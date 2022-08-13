import * as Prismic from '@prismicio/client';

export function getPrismictClient(req?: unknown) {
  const endpoint = Prismic.getEndpoint(process.env.PRISMIC_REPOSITORY_NAME)
  const client = Prismic.createClient(endpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  });

  if(req) {
    client.enableAutoPreviewsFromReq(req);
  }
  
  return client;
}