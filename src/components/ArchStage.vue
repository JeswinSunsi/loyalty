<template>
  <!-- A market arch at golden hour, with whatever sits in front of it (usually a card). -->
  <div class="stage">
    <div class="stage-arch" aria-hidden="true"><span class="stage-sun" /></div>
    <div class="stage-front"><slot /></div>
  </div>
</template>
