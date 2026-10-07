import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 420 },
    content: { type: String, required: true, trim: true, maxlength: 100000 },
    coverImage: { type: String, trim: true, maxlength: 2048, default: "" },
    category: { type: String, trim: true, maxlength: 60, default: "ZARR Stories" },
    author: { type: String, trim: true, maxlength: 100, default: "ZARR Editorial" },
    sourceUrl: { type: String, trim: true, maxlength: 2048, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ title: "text", excerpt: "text", content: "text", category: "text" });

export default mongoose.model("Article", articleSchema);
