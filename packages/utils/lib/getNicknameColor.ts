const nameColors = [
  '#0c80d3',
  '#047143',
  '#ad19e1',
  '#6518c8',
  '#119937',
  '#c40f70',
  '#dd32e0',
  '#1915bf',
  '#0799b9',
  '#0c61e1',
  '#648e0b',
  'e12e2e',
  '#b26c03',
  'eb500d',
  '#c25111',
  '#0b6d82',
];

export function getNicknameColor(userId: number) {
  return nameColors[userId % nameColors.length];
}
