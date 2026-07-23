import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("../views/Home.vue"),
        },
        {
            path: "/datasets/:id",
            name: "dataset-detail",
            component: () => import("../views/DatasetDetail.vue"),
        },
    ],
    scrollBehavior(to) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: "smooth",
            };
        }
        return { top: 0 };
    },
});

export default router;
