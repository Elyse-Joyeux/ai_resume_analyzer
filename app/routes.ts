import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/Auth.tsx'),
    route('/upload', 'routes/Upload.tsx'),
    route('/resume/:id', 'routes/Resume.tsx'),
    route('/wipe', 'routes/Wipe.tsx'),
] satisfies RouteConfig;
