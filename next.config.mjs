/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint:{
        ignoreDuringBuilds:true,
    },
    modularizeImports:{
        lodash:{
            transform:'lodash/{{member}}'
        },
        '@material-ui/core/':{
            transform:'@material-ui/core/{{member}}'
        },
        '@material-ui/lab/':{
            transform:'@material-ui/lab/{{member}}'
        },
        '@material-ui/icons/?(((\\w*)?/?)*)':{
            transform:'@material-ui/icons/{{ matches.[1] }}/{{member}}'
        }
    },
    images:{
        domains: [
            "utfs.io"
        ]
    }
};

export default nextConfig;
