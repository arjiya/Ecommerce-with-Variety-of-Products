# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from recommender import get_recommendations

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # allow React
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/recommend/{product_id}")
# def recommend(product_id: int):
#     recs = get_recommendations(product_id)
#     return recs
# app.py
import requests
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ------------------------------
# FASTAPI SETUP
# ------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow React frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# LOAD PRODUCTS AND BUILD MODEL
# ------------------------------
def load_products():
    url = "https://fakestoreapi.com/products"
    data = requests.get(url).json()
    df = pd.DataFrame(data)
    # Use rating.count as popularity
    df["popularity"] = df["rating"].apply(lambda x: x["count"] if isinstance(x, dict) else 0)
    return df

def build_model(df):
    # Combine text fields for similarity
    df["text"] = df["title"] + " " + df["description"] + " " + df["category"]
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(df["text"])
    sim_matrix = cosine_similarity(tfidf_matrix)
    return sim_matrix

# ------------------------------
# RECOMMENDATION FUNCTIONS
# ---------------------------  ---
def content_based_recommend(df, sim_matrix, product_id, top_n=5, same_category=True):
    idx = df.index[df["id"] == int(product_id)][0]
    scores = list(enumerate(sim_matrix[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)
    top_scores = scores[1: top_n + 1]  # skip itself

    recommended_ids = [df.iloc[i[0]]["id"] for i in top_scores]
    rec_df = df[df["id"].isin(recommended_ids)]

    if same_category:
        category = df.iloc[idx]["category"]
        rec_df = rec_df[rec_df["category"] == category]

    return rec_df

def popular_recommend(df, top_n=5):
    return df.sort_values(by="popularity", ascending=False).head(top_n)

# ------------------------------
# CACHE PRODUCTS & SIMILARITY
# ------------------------------
products_df = load_products()
similarity_matrix = build_model(products_df)

# ------------------------------
# API ENDPOINTS
# ------------------------------
@app.get("/")
def home():
    return {"message": "FastAPI hybrid recommendation backend is running!"}

@app.get("/recommend/{product_id}")
def recommend(product_id: int):
    # Content-based recommendations
    you_may_like = content_based_recommend(products_df, similarity_matrix, product_id, top_n=5)

    # Popular recommendations
    popular = popular_recommend(products_df, top_n=5)

    return {
        "you_may_like": you_may_like.to_dict(orient="records"),
        "popular": popular.to_dict(orient="records")
    }

