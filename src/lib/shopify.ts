export interface ShopifyImageNode {
  url: string;
  altText: string | null;
}

export interface ShopifyImageEdge {
  node: ShopifyImageNode;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyVariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: ShopifySelectedOption[];
}

export interface ShopifyVariantEdge {
  node: ShopifyVariantNode;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: ShopifyImageEdge[];
  };
  variants: {
    edges: ShopifyVariantEdge[];
  };
}

export interface ShopifyProductEdge {
  node: ShopifyProduct;
}

interface ShopifyFetchResponse {
  data?: {
    product?: ShopifyProduct;
    products?: {
      edges: ShopifyProductEdge[];
    };
    cartCreate?: {
      cart?: {
        id: string;
        checkoutUrl: string;
      };
      userErrors?: {
        field: string[];
        message: string;
      }[];
    };
  };
  errors?: unknown[];
}

const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch({ query, variables }: { query: string; variables?: Record<string, unknown> }): Promise<ShopifyFetchResponse | null> {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    return await response.json() as ShopifyFetchResponse;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return null;
  }
}

export const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  // If no credentials, return null so we can use local fallback
  if (!domain || !storefrontAccessToken || storefrontAccessToken === 'your_access_token_here') {
    return null;
  }

  const response = await shopifyFetch({
    query: getProductQuery,
    variables: { handle },
  });

  return response?.data?.product || null;
}

export const createCartMutation = `
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function createCheckout(items: { variantId: string; quantity: number }[]): Promise<string | null> {
  if (!domain || !storefrontAccessToken || storefrontAccessToken === 'your_access_token_here') {
    return null;
  }

  const lines = items.map(item => ({
    merchandiseId: item.variantId,
    quantity: item.quantity
  }));

  const response = await shopifyFetch({
    query: createCartMutation,
    variables: {
      input: {
        lines
      }
    }
  });

  if (response?.data?.cartCreate?.userErrors && response.data.cartCreate.userErrors.length > 0) {
    console.error('Shopify Cart User Errors:', response.data.cartCreate.userErrors);
  }

  return response?.data?.cartCreate?.cart?.checkoutUrl || null;
}

export const getProductsQuery = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getProducts(first: number = 10): Promise<ShopifyProduct[] | null> {
  if (!domain || !storefrontAccessToken || storefrontAccessToken === 'your_access_token_here') {
    return null;
  }

  const response = await shopifyFetch({
    query: getProductsQuery,
    variables: { first },
  });

  return response?.data?.products?.edges?.map((edge: ShopifyProductEdge) => edge.node) || null;
}

