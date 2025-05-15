export default function Head() {
  return (
    <>
      <title>Maistas Jūsų sveikatai!</title>
      <meta name="title" content="Maistas Jūsų sveikatai!" />
      <meta name="description" content="Sveika mityba dabar yra ne tik išmintinga, bet ir stilinga. Čia rasite kruopščiai atrinktus tik ekologiškus, gamtai draugiškus ir patvirtintus produktus. Norite pagerinti savo mitybą? Pasirinkite savo mėgstamus produktus ir mėgaukitės jų pristatymu tiesiai pas Jus kiekvieną mėnesį, atsikratydami visų rūpesčių." />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://ekofood.lt/" />
      <meta property="og:title" content="Maistas Jūsų sveikatai!" />
      <meta property="og:description" content="Sveika mityba dabar yra ne tik išmintinga, bet ir stilinga..." />
      <meta property="og:image" content="https://ekofood.lt/image.jpg" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://ekofood.lt/" />
      <meta property="twitter:title" content="Maistas Jūsų sveikatai!" />
      <meta property="twitter:description" content="Sveika mityba dabar yra ne tik išmintinga, bet ir stilinga..." />
      <meta property="twitter:image" content="https://ekofood.lt/image.jpg" />
    </>
  );
}
