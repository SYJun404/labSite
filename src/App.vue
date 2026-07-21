<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import Hero from "./components/Hero.vue";
import Research from "./components/Research.vue";
import Publications from "./components/Publications.vue";
import Team from "./components/Team.vue";
import Admissions from "./components/Admissions.vue";
import News from "./components/News.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
    <div class="min-h-screen bg-bg">
        <Navbar />
        <main>
            <Hero />
            <Research />
            <Publications />
            <Team />
            <Admissions />
            <News />
        </main>
        <Footer />
    </div>
</template>
