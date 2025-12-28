"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
exports.ensureSlug = ensureSlug;
function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-')
        .trim();
}
function ensureSlug(value, fallback) {
    const slugFromValue = slugify(value);
    const slugFromFallback = slugify(fallback);
    return slugFromValue || slugFromFallback || `item-${Date.now()}`;
}
//# sourceMappingURL=slugify.js.map