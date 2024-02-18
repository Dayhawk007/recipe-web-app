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
                destination:"http://localhost:5000/:path*"
            }
        ]
    }
};

export default nextConfig;
