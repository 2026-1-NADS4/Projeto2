# 📊 UrbanScore São Paulo

O **UrbanScore São Paulo** é uma aplicação interativa desenvolvida com **Streamlit** para análise de densidade urbana e infraestrutura dos distritos de São Paulo, utilizando dados do **Censo 2022 (IBGE)**.

A ferramenta permite visualizar o "UrbanScore", uma métrica calculada que combina densidade populacional e indicadores de infraestrutura, apresentando rankings e dados detalhados de forma intuitiva.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar o ambiente e rodar a aplicação em sua máquina local.

### 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
- [Python 3.8+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/) (gerenciador de pacotes do Python)

### 🔧 Instalação

1. **Clone o repositório ou baixe os arquivos:**
   ```bash
   git clone <url-do-repositorio>
   cd ADS4
   ```

2. **(Opcional) Crie um ambiente virtual:**
   É recomendável usar um ambiente virtual para manter as dependências isoladas.
   ```bash
   python -m venv venv
   ```
   Ative o ambiente:
   - **Windows:** `.\venv\Scripts\activate`
   - **Linux/macOS:** `source venv/bin/activate`

3. **Instale as dependências:**
   Execute o seguinte comando para instalar as bibliotecas necessárias:
   ```bash
   pip install -r requirements.txt
   ```

---

## 🏃 Como Rodar a Aplicação

Com as dependências instaladas, basta executar o Streamlit apontando para o arquivo principal:

```bash
python -m streamlit run app.py
```

Após o comando, o Streamlit abrirá automaticamente uma aba no seu navegador padrão (geralmente em `http://localhost:8501`).

---

## 📂 Estrutura de Arquivos

- `app.py`: O código principal da aplicação Streamlit.
- `urbanis_dataset.csv`: Base de dados principal com informações de população e área por distrito.
- `codigos_distritos_msp.csv`: Mapeamento de códigos e nomes dos distritos de SP.
- `dic_censo2022_setores_censitarios.csv`: Dicionário de dados do Censo 2022.

---

## 📊 Sobre o UrbanScore

O cálculo do UrbanScore neste modelo exploratório é baseado em:
- **50% Densidade Populacional**: Habitantes por km².
- **50% Infraestrutura**: Baseada em proxies de dados censitários.

### Escala de Pontuação:
- **80+**: Alta concentração urbana.
- **50–80**: Regiões de densidade intermediária.
- **<50**: Baixa densidade/infraestrutura em transição.

---

## 🛠️ Tecnologias Utilizadas

- **Python**: Linguagem base.
- **Streamlit**: Framework para criação de dashboards web.
- **Pandas**: Manipulação e análise de dados.
- **Plotly**: Visualizações gráficas interativas.

---

**Desenvolvido como parte do Projeto Integrador (PI) - ADS4.**
