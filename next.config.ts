import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    //serverアクションを有効に、ドメイン設定
    experimental: {
      optimizePackageImports: ["@chakra-ui/react"],
      serverActions: true,
    },
    images: {
      domains: ['zwdgytsyhsiqgdnuhizz.supabase.co'],
    },
  
};

export default nextConfig;
