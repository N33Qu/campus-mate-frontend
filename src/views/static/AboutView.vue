<script setup>
import AuthorListings from "@/components/static/AuthorListings.vue";
import SimpleInfoListings from "@/components/ui/SimpleInfoListings.vue";
import Button from "@/components/ui/Button.vue";
const authors = [
  {
    name: "Ewelnia Sałata",
    role: "Programista",
    github: "https://github.com/Valentine0604",
    linkedin: "https://www.linkedin.com/in/ewelina-sa%C5%82ata-a2a330244/",
    image: "Ewelina.png"
  },
  {
    name: "Mikołaj Stasz",
    role: "Programista",
    github: "https://github.com/N33Qu",
    linkedin: "https://www.linkedin.com/in/miko%C5%82aj-stasz-61895828a/",
    image: "Mikolaj.png"
  },
]

const siteInfo = [
  {
    title: "Nasz Cel",
    description: "Opracowanie systemu, który poprawi wymianę informacji między prowadzącymi zajęcia\n" +
        "a studentami oraz ułatwi wzajemną komunikację i pomoże nowym studentom w odnalezieniu się na uczelni.\n"
  },
  {
    title: "Historia Strony",
    description: "Stworzona w 2024 r w ramach pracy inzynierskiej na Politechnice Lubelskiej."
  }
]

const siteTitle = "O Naszej Stronie";
</script>

<template>
  <div class="min-h-screen bg-appBg text-black py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-elementLight rounded-lg shadow-lg overflow-hidden">
      <!-- Site Information Section -->
      <SimpleInfoListings :listings-title="siteTitle" :listings="siteInfo"/>
      <!-- Authors Section -->
      <AuthorListings :authors="authors"/>

      <!-- Contact Section -->
      <div class="p-8 text-center">
        <h2 class="text-2xl font-semibold mb-4 text-headerText">Kontakt</h2>
        <p class="mb-6">
          Zainteresowany naszą pracą
          Napisz do nas na <a
            href="mailto:ewecia.s@gmail.com"
            class="text-textLink hover:text-textLinkHover transition-colors"
        >
          ewecia.s@gmail.com
        </a>
        </p>
        <Button :text="'Skontaktuj Się'" :to="'/contact'"/>
      </div>

    </div>
  </div>
</template>
