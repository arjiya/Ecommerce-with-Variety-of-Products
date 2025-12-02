# import requests
# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity

# # ------------------------------
# # LOAD PRODUCT DATA FROM API
# # ------------------------------
# def load_products():
#     url = "https://fakestoreapi.com/products"
#     data = requests.get(url).json()
#     df = pd.DataFrame(data)
#     return df

# # ------------------------------
# # BUILD ML MODEL
# # ------------------------------
# def build_model():
#     df = load_products()

#     # Combine text fields for better similarity
#     df["text"] = df["title"] + " " + df["description"] + " " + df["category"]

#     vectorizer = TfidfVectorizer(stop_words="english")
#     tfidf_matrix = vectorizer.fit_transform(df["text"])

#     similarity_matrix = cosine_similarity(tfidf_matrix)

#     return df, similarity_matrix


# # ------------------------------
# # GET RECOMMENDATIONS
# # ------------------------------
# def get_recommendations(product_id, top_n=5):
#     df, sim_matrix = build_model()

#     # Convert product_id to index
#     idx = df.index[df["id"] == int(product_id)][0]

#     # Get similarity scores
#     scores = list(enumerate(sim_matrix[idx]))

#     # Sort by similarity (highest first)
#     scores = sorted(scores, key=lambda x: x[1], reverse=True)

#     # Pick top N similar products (skip itself)
#     top_scores = scores[1: top_n + 1]

#     recommended_ids = [df.iloc[i[0]]["id"] for i in top_scores]

#     rec_df = df[df["id"].isin(recommended_ids)]

#     return rec_df.to_dict(orient="records")
