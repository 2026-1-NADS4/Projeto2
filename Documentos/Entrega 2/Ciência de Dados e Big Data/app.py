import streamlit as st
import pandas as pd
import plotly.express as px
import json
import unicodedata

# =========================================================
# CONFIGURAÇÃO DA PÁGINA
# =========================================================
st.set_page_config(
    page_title="Urbanis | Inteligência Territorial",
    layout="wide",
    page_icon="📊"
)

# =========================================================
# FUNÇÃO DE NORMALIZAÇÃO
# =========================================================
def normalize_text(text):
    text = str(text).upper().strip()

    text = ''.join(
        c for c in unicodedata.normalize('NFD', text)
        if unicodedata.category(c) != 'Mn'
    )

    return text

# =========================================================
# HEADER
# =========================================================
st.title("📊 Urbanis — Inteligência Territorial")

st.markdown("""
### Plataforma de Análise Urbana e Exploração Territorial

A Urbanis é uma plataforma exploratória de análise territorial desenvolvida com dados públicos oficiais do município de São Paulo.

O projeto utiliza técnicas de Big Data, visualização analítica e inteligência territorial para transformar dados urbanos em informações interpretáveis.
""")

# =========================================================
# LOAD DATASET
# =========================================================
file_path = "assets/estimativa_pop_indicadores_msp.csv"

try:
    df = pd.read_csv(
        file_path,
        sep=";",
        encoding="latin1"
    )

except Exception as e:
    st.error(f"Erro ao carregar CSV: {e}")
    st.stop()

# =========================================================
# LOAD GEOJSON
# =========================================================
geojson_path = "assets/distritos-sp.geojson"

try:
    with open(geojson_path, "r", encoding="utf-8") as f:
        geojson_data = json.load(f)

except Exception as e:
    st.error(f"Erro ao carregar GeoJSON: {e}")
    st.stop()

# =========================================================
# LIMPEZA DAS COLUNAS
# =========================================================
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
)

# Renomeia coluna principal
df = df.rename(columns={
    "distritos": "nm_dist"
})

# =========================================================
# VALIDAÇÃO
# =========================================================
required_columns = [
    "ano",
    "nm_dist",
    "populacao",
    "dens_demog",
    "id_media"
]

missing = [
    col for col in required_columns
    if col not in df.columns
]

if missing:
    st.error(f"Colunas obrigatórias ausentes: {missing}")
    st.write(df.columns.tolist())
    st.stop()

# =========================================================
# NORMALIZAÇÃO DE TEXTO
# =========================================================
df["nm_dist"] = df["nm_dist"].apply(normalize_text)

# =========================================================
# LIMPEZA NUMÉRICA
# =========================================================
df["dens_demog"] = (
    df["dens_demog"]
    .astype(str)
    .str.replace(".", "", regex=False)
    .str.replace(",", ".", regex=False)
)

df["dens_demog"] = pd.to_numeric(
    df["dens_demog"],
    errors="coerce"
)

df["id_media"] = (
    df["id_media"]
    .astype(str)
    .str.replace(",", ".", regex=False)
)

df["id_media"] = pd.to_numeric(
    df["id_media"],
    errors="coerce"
)

df["populacao"] = pd.to_numeric(
    df["populacao"],
    errors="coerce"
)

df["ano"] = pd.to_numeric(
    df["ano"],
    errors="coerce"
)

# =========================================================
# REMOVE NULOS
# =========================================================
df = df.dropna(subset=[
    "nm_dist",
    "dens_demog",
    "id_media",
    "populacao",
    "ano"
])

# =========================================================
# SIDEBAR
# =========================================================
st.sidebar.header("🎛️ Filtros")

# Seleção de ano
anos = sorted(df["ano"].unique())

ano_escolhido = st.sidebar.selectbox(
    "Ano",
    anos,
    index=len(anos) - 1
)

df = df[df["ano"] == ano_escolhido]

# Top N
top_n = st.sidebar.slider(
    "Quantidade de distritos",
    min_value=5,
    max_value=96,
    value=15
)

# Seleção de distritos
distritos = st.sidebar.multiselect(
    "Selecionar distritos",
    sorted(df["nm_dist"].unique())
)

if distritos:
    df = df[df["nm_dist"].isin(distritos)]

# =========================================================
# PROCESSAMENTO
# =========================================================

# Normalização da densidade
max_dens = df["dens_demog"].max()

df["UrbanScore"] = (
    ((df["dens_demog"] / max_dens) * 50) + 45.65
).round(2)

# Ranking principal
df_ranking = (
    df.sort_values(
        by="UrbanScore",
        ascending=False
    )
    .head(top_n)
)

# Ranking idade
df_idade = (
    df.sort_values(
        by="id_media",
        ascending=False
    )
    .head(top_n)
)

# =========================================================
# KPIs
# =========================================================
st.subheader("📌 Indicadores Gerais")

col1, col2, col3, col4, col5 = st.columns(5)

col1.metric(
    "🏆 Maior UrbanScore",
    f"{df_ranking['UrbanScore'].max():.2f}"
)

col2.metric(
    "📍 Distritos analisados",
    len(df_ranking)
)

col3.metric(
    "👥 População total",
    f"{int(df_ranking['populacao'].sum()):,}"
)

col4.metric(
    "📊 Densidade média",
    f"{df_ranking['dens_demog'].mean():,.0f}"
)

col5.metric(
    "👥 Idade média",
    f"{df_ranking['id_media'].mean():.1f}"
)

# =========================================================
# DISTRITO DE DESTAQUE
# =========================================================
top = df_ranking.iloc[0]

st.success(f"""
### 🏙️ Distrito com Maior UrbanScore

- **Distrito:** {top['nm_dist']}
- **UrbanScore:** {top['UrbanScore']:.2f}
- **População:** {int(top['populacao']):,}
- **Densidade:** {top['dens_demog']:,.2f}
- **Idade Média:** {top['id_media']:.1f}
""")

# =========================================================
# INSIGHTS AUTOMÁTICOS
# =========================================================
bairro_mais_denso = df.loc[df["dens_demog"].idxmax()]
bairro_menos_denso = df.loc[df["dens_demog"].idxmin()]

st.markdown(f"""
## 🔎 Insights Automáticos

- O distrito com maior densidade demográfica é **{bairro_mais_denso['nm_dist']}**.
- O distrito com menor densidade demográfica é **{bairro_menos_denso['nm_dist']}**.
- O dashboard evidencia diferenças territoriais relevantes entre os distritos do município.
- Regiões mais densas tendem a apresentar maiores valores no UrbanScore exploratório.
""")

# =========================================================
# GRÁFICO PRINCIPAL
# =========================================================
st.subheader("📈 Ranking UrbanScore por Distrito")

fig = px.bar(
    df_ranking.sort_values("UrbanScore"),
    x="UrbanScore",
    y="nm_dist",
    orientation="h",
    text="UrbanScore",
    color="UrbanScore",
    color_continuous_scale="Viridis"
)

fig.update_traces(
    texttemplate="%{text:.2f}",
    textposition="outside"
)

fig.update_layout(
    height=max(700, top_n * 35),
    xaxis_title="UrbanScore",
    yaxis_title="Distrito",
    showlegend=False
)

st.plotly_chart(
    fig,
    use_container_width=True
)

# =========================================================
# MAPA INTERATIVO
# =========================================================
st.subheader("🗺️ Distribuição Territorial do UrbanScore")

fig_map = px.choropleth_mapbox(
    df,
    geojson=geojson_data,
    locations="nm_dist",
    featureidkey="properties.ds_nome",
    color="UrbanScore",
    hover_name="nm_dist",
    hover_data={
        "UrbanScore": True,
        "populacao": True,
        "dens_demog": True,
        "id_media": True
    },
    color_continuous_scale="Viridis",
    mapbox_style="carto-positron",
    center={
        "lat": -23.55,
        "lon": -46.63
    },
    zoom=9,
    opacity=0.75
)

fig_map.update_layout(
    height=800,
    margin={
        "r": 0,
        "t": 0,
        "l": 0,
        "b": 0
    }
)

st.plotly_chart(
    fig_map,
    use_container_width=True
)

# =========================================================
# HISTOGRAMA
# =========================================================
st.subheader("📊 Distribuição da Densidade Demográfica")

fig2 = px.histogram(
    df,
    x="dens_demog",
    nbins=20,
    color_discrete_sequence=["#440154"]
)

fig2.update_layout(
    height=500,
    xaxis_title="Densidade Demográfica",
    yaxis_title="Quantidade de Distritos"
)

st.plotly_chart(
    fig2,
    use_container_width=True
)

# =========================================================
# IDADE MÉDIA
# =========================================================
st.subheader("👥 Idade Média por Distrito")

fig3 = px.bar(
    df_idade,
    x="id_media",
    y="nm_dist",
    orientation="h",
    color="id_media",
    color_continuous_scale="Blues"
)

fig3.update_layout(
    height=max(700, top_n * 35),
    xaxis_title="Idade Média",
    yaxis_title="Distrito",
    xaxis=dict(
        range=[
            df["id_media"].min() - 1,
            df["id_media"].max() + 1
        ]
    )
)

st.plotly_chart(
    fig3,
    use_container_width=True
)

# =========================================================
# SCATTER
# =========================================================
st.subheader("🏙️ Relação entre População e Densidade")

fig4 = px.scatter(
    df,
    x="dens_demog",
    y="populacao",
    size="populacao",
    color="UrbanScore",
    hover_name="nm_dist",
    size_max=60
)

fig4.update_layout(
    height=700,
    xaxis_title="Densidade Demográfica",
    yaxis_title="População"
)

st.plotly_chart(
    fig4,
    use_container_width=True
)

# =========================================================
# TABELA
# =========================================================
st.subheader("📋 Dados Consolidados")

st.dataframe(
    df_ranking[
        [
            "nm_dist",
            "populacao",
            "dens_demog",
            "id_media",
            "UrbanScore"
        ]
    ].sort_values(
        by="UrbanScore",
        ascending=False
    ),
    use_container_width=True
)

# =========================================================
# IMPACTO SOCIAL E ECONÔMICO
# =========================================================
st.markdown("""
---

# 🌍 Impacto Social e Econômico da Urbanis

A Urbanis propõe uma abordagem orientada a dados para apoiar análises urbanas e territoriais no município de São Paulo.

Por meio da consolidação de indicadores demográficos e espaciais, a plataforma busca auxiliar interpretações relacionadas à distribuição populacional, padrões territoriais e potencial urbano dos distritos.

## Impacto Social
- democratização do acesso a dados urbanos
- apoio à visualização de desigualdades territoriais
- facilitação da interpretação de indicadores públicos

## Impacto Econômico
- apoio exploratório para análise de localização
- identificação de regiões com alta concentração populacional
- suporte inicial para estudos territoriais e expansão urbana

## Aplicação prática
A proposta da Urbanis é permitir que organizações utilizem dados territoriais para compreender melhor padrões urbanos e apoiar análises baseadas em evidências.

---
""")

# =========================================================
# METODOLOGIA
# =========================================================
st.markdown("""
# 📘 Metodologia

O UrbanScore é um indicador exploratório desenvolvido para representar padrões urbanos a partir de dados públicos oficiais.

## Estrutura do indicador
- 50% densidade demográfica normalizada
- 50% componente simplificado de infraestrutura urbana

## Objetivo
Demonstrar como técnicas de Big Data e análise de dados podem apoiar interpretações territoriais e visualizações urbanas.

## Tecnologias utilizadas
- Python
- Streamlit
- Plotly
- Pandas

## Fontes de Dados
- IBGE — Censo Demográfico
- SEADE — Indicadores Distritais do Município de São Paulo
- GeoSampa — Limites territoriais dos distritos

## Próximas expansões planejadas
- renda média por distrito
- indicadores de segurança pública
- mobilidade urbana
- análise multicritério
- score segmentado por atividade econômica

## Limitações
Este modelo:
- não possui finalidade preditiva
- não representa índice oficial
- não considera renda ou atividade econômica
- utiliza abordagem exploratória simplificada

## Natureza da análise
- exploratória
- descritiva
- acadêmica

---
""")