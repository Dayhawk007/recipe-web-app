/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'media.discordapp.net',
                port:'',
                pathname:'/**'
            }
        ]
    },
    async rewrites(){
        return[
            {
                source:"/api/:path*",
                destination:"https://recipe-web-app-backend.vercel.app/api/:path*"
            }
        ]
    }
};

export default nextConfig;
