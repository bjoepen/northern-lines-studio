<script lang="ts">
  import type { StudioPage } from './project';
  import { curatedChecklistDefinitionFor } from './curated-checklist';

  export let page: StudioPage;

  const travelPreparationHero = '/design-library/curated-heroes/travel-preparation.png';

  $: definition = curatedChecklistDefinitionFor(page.knowledgeType);
</script>

{#if definition}
  <div class="curated-checklist-preview" aria-label={`Checkliste Teil ${definition.part} von 2`}>
    <header class="curated-checklist-head curated-hero-flow">
      <img
        class="curated-world-hero"
        src={travelPreparationHero}
        alt=""
        aria-hidden="true"
      />
      <div class="curated-checklist-kicker">Vor der Reise</div>
      <div class="curated-checklist-title-row">
        <h1>{definition.title}</h1>
      </div>
      <p>{definition.deck}</p>
    </header>

    <div class="curated-checklist-sections">
      {#each definition.sections as section, sectionIndex (section.id)}
        <section class="curated-checklist-section">
          <header>
            <span>{String(sectionIndex + 1).padStart(2, '0')}</span>
            <strong>{section.label}</strong>
          </header>
          <ul>
            {#each section.items as item}
              <li><span class="curated-check-box" aria-hidden="true"></span><span>{item}</span></li>
            {/each}
          </ul>
        </section>
      {/each}
    </div>

    {#if definition.closingNote}
      <aside class="curated-checklist-note">
        <span>Noch gut zu wissen</span>
        <p>{definition.closingNote}</p>
      </aside>
    {/if}
  </div>
{/if}
