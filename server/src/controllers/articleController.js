import mongoose from "mongoose";
import Article from "../models/Article.js";

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150)
    .replace(/-+$/g, "");
}

async function createUniqueSlug(title, excludeId) {
  const base = slugify(title) || "article";
  let slug = base;
  let suffix = 2;

  while (await Article.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

function validateArticleInput(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "An article payload is required.";
  }
  const fields = ["title", "excerpt", "content", "coverImage", "category", "author", "sourceUrl"];
  for (const field of fields) {
    if (body[field] !== undefined && typeof body[field] !== "string") {
      return `${field} must be text.`;
    }
  }
  if (body.status !== undefined && !["draft", "published"].includes(body.status)) {
    return "Status must be draft or published.";
  }
  for (const field of ["coverImage", "sourceUrl"]) {
    const value = body[field]?.trim();
    if (!value) continue;
    try {
      const url = new URL(value);
      if (!(["http:", "https:"].includes(url.protocol))) throw new Error();
    } catch {
      return `${field} must be a valid HTTP or HTTPS URL.`;
    }
  }
  return null;
}

function publishedAtFor(status, existingPublishedAt) {
  if (status !== "published") return null;
  return existingPublishedAt || new Date();
}

async function getPublishedArticles(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 30, 1), 60);
    const articles = await Article.find({ status: "published" })
      .select("title slug excerpt coverImage category author sourceUrl publishedAt createdAt")
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    res.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300").json(articles);
  } catch (err) {
    next(err);
  }
}

async function getPublishedArticle(req, res, next) {
  try {
    const article = await Article.findOne({ slug: req.params.slug, status: "published" }).lean();
    if (!article) return res.status(404).json({ message: "Article not found." });
    res.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300").json(article);
  } catch (err) {
    next(err);
  }
}

async function getAdminArticles(req, res, next) {
  try {
    const articles = await Article.find().sort({ updatedAt: -1 }).lean();
    res.set("Cache-Control", "no-store").json(articles);
  } catch (err) {
    next(err);
  }
}

async function createArticle(req, res, next) {
  try {
    const inputError = validateArticleInput(req.body);
    if (inputError) return res.status(400).json({ message: inputError });
    const status = req.body.status || "draft";
    const article = await Article.create({
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      coverImage: req.body.coverImage || "",
      category: req.body.category || "ZARR Stories",
      author: req.body.author || "ZARR Editorial",
      sourceUrl: req.body.sourceUrl || "",
      slug: await createUniqueSlug(req.body.title),
      status,
      publishedAt: publishedAtFor(status),
    });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
}

async function updateArticle(req, res, next) {
  try {
    const inputError = validateArticleInput(req.body);
    if (inputError) return res.status(400).json({ message: inputError });
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid article identifier." });
    }

    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found." });

    for (const field of ["title", "excerpt", "content", "coverImage", "category", "author", "sourceUrl"]) {
      if (req.body[field] !== undefined) article[field] = req.body[field].trim();
    }
    if (req.body.title !== undefined) {
      article.slug = await createUniqueSlug(req.body.title, article._id);
    }
    if (req.body.status !== undefined) {
      article.status = req.body.status;
      article.publishedAt = publishedAtFor(article.status, article.publishedAt);
    }
    await article.save();
    res.json(article);
  } catch (err) {
    next(err);
  }
}

async function deleteArticle(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid article identifier." });
    }
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found." });
    res.json({ message: "Article deleted." });
  } catch (err) {
    next(err);
  }
}

export { getPublishedArticles, getPublishedArticle, getAdminArticles, createArticle, updateArticle, deleteArticle };
