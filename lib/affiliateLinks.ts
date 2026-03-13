const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'MY_ASSOCIATE_TAG';

/**
 * Get Amazon affiliate URL for a product
 * If ASIN is provided, links directly to product page
 * Otherwise, links to search results
 */
export function getAffiliateUrl(productName: string, asin?: string): string {
  if (asin) {
    return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
  }
  const encoded = encodeURIComponent(productName);
  return `https://www.amazon.com/s?k=${encoded}&tag=${AMAZON_TAG}`;
}

/**
 * Get Amazon product image URL from ASIN
 * Returns empty string if no ASIN provided
 */
export function getAmazonImageUrl(asin: string): string {
  if (!asin) return '';
  return `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&Format=_SL300_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1`;
}

export { AMAZON_TAG };
