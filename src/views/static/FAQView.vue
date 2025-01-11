<script setup>
import FAQQuestion from "@/components/static/FAQQuestion.vue"

const faqData = [
  {
    question: "Jaki jest główny cel opracowanego systemu?",
    answer: "Głównym celem systemu jest poprawa wymiany informacji między prowadzącymi zajęcia a studentami, " +
        "ułatwienie wzajemnej komunikacji oraz pomoc nowym studentom w odnalezieniu się na uczelni."
  },
  {
    question: "W jaki sposób system ma pomóc nowym studentom?",
    answer: "System ma ułatwić nowym studentom odnalezienie się na uczelni poprzez dostarczanie ważnych informacji " +
        "w przejrzysty sposób oraz umożliwienie łatwej komunikacji z prowadzącymi i innymi studentami."
  },
  {
    question: "Kiedy i w jakim celu stworzono stronę?",
    answer: "Stronę stworzono w 2024 roku w ramach pracy inżynierskiej na Politechnice Lubelskiej, " +
        "aby rozwiązać problem komunikacji i wymiany informacji na uczelni."
  },
  {
    question: "Na jakiej uczelni opracowano ten system?",
    answer: "System opracowano na Politechnice Lubelskiej."
  },
  {
    question: "Kto może korzystać z systemu?",
    answer: "Z systemu mogą korzystać zarówno prowadzący zajęcia, jak i studenci."
  },
  {
    question: "Dlaczego opracowanie takiego systemu jest ważne?",
    answer: "Opracowanie systemu jest ważne, ponieważ poprawia komunikację między prowadzącymi a studentami, " +
        "co przyczynia się do lepszego zrozumienia wymagań i organizacji zajęć, " +
        "a także wspiera integrację nowych studentów w środowisku akademickim."
  },
  {
    question: "Jakie korzyści przynosi system dla prowadzących zajęcia?",
    answer: "System ułatwia prowadzącym zajęcia szybkie i skuteczne przekazywanie informacji do studentów, " +
        "takich jak materiały dydaktyczne, terminy zajęć czy zmiany w harmonogramie."
  }
]
</script>

<template>
  <div class=" py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-[#f4f2ef] rounded-lg shadow-lg p-8">
      <h1 class="text-4xl font-bold mb-10 text-center" style="color: #4e4945;">
        Frequently Asked Questions
      </h1>

      <div class="space-y-4">
        <FAQQuestion
            v-for="(faq, index) in faqData"
            :key="index"
            :question="faq.question"
            :answer="faq.answer"
        />
      </div>

      <div class="mt-10 text-center">
        <p class="text-lg text-gray-700">
          Wciąż masz pytania.
          <a
              href="/contact"
              class="text-textLink hover:text-textLinkHover font-semibold"
          >
             Napisz do nas
          </a>
        </p>
      </div>
    </div>
  </div>
</template>