const p = (id, name, category, title, views) => ({
  id,
  name,
  category,
  title,
  views,
  video: `/videos/${id}.mp4`,
  poster: "/karima.jpg",
});

export const categories = ["All", "Skincare", "Perfume", "Fashion", "Food"];

export const projects = [
  p("929", "929", "Food", "929", "18.4K"),
  p("asmr perfumes", "ASMR Perfumes", "Perfume", "ASMR Perfumes", "42.7K"),
  p("be you", "Be You", "Skincare", "Be You", "27.3K"),
  p("black friday", "Black Friday", "Skincare", "Black Friday", "63.8K"),
  p("brand elhawanem", "Brand Elhawanem", "Fashion", "Brand Elhawanem", "35.2K"),
  p("cotton house", "Cotton House", "Fashion", "Cotton House", "51.6K"),
  p("dr_amlm289", "Dr Amlm289", "Skincare", "Dr Amlm289", "12.9K"),
  p("evalcostmetics", "Eval Cosmetics", "Skincare", "Eval Cosmetics", "38.5K"),
  p("forrestoreaurant", "Forrest Restaurant", "Food", "Forrest Restaurant", "24.6K"),
  p("hairoots", "Hairroots", "Skincare", "Hairroots", "72.4K"),
  p("jaline's", "Jaline's", "Fashion", "Jaline's", "19.8K"),
  p("kayan scarf", "Kayan Scarf", "Fashion", "Kayan Scarf", "45.3K"),
  p("kovi eg", "Kovi EG", "Fashion", "Kovi EG", "31.7K"),
  p("kovi_eg", "Kovi EG", "Fashion", "Kovi EG", "16.5K"),
  p("linen denim", "Linen Denim", "Fashion", "Linen Denim", "54.9K"),
  p("medad", "Medad", "Fashion", "Medad", "22.1K"),
  p("meloura eg", "Meloura EG", "Fashion", "Meloura EG", "67.3K"),
  p("memo1", "Memo1", "Fashion", "Memo1", "9.6K"),
  p("memories", "Memories", "Fashion", "Memories", "14.8K"),
  p("say soft", "Say Soft", "Fashion", "Say Soft", "29.5K"),
  p("she shines", "She Shines", "Fashion", "She Shines", "41.2K"),
  p("tech_me", "Tech Me", "Fashion", "Tech Me", "11.7K"),
  p("ugc by kema", "UGC by Kema", "Perfume", "UGC by Kema", "36.9K"),
  p("ugc_by-kema", "UGC by Kema", "Skincare", "UGC by Kema", "58.2K"),
];