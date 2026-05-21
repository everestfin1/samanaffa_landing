/** Autres.png has more inset padding; base scale so it matches other project icons. */
const AUTRES_SCALE_CLASSES = 'scale-[1.35] group-hover:scale-[1.485]';

export function isAutresProject(slugOrId: string | number | undefined): boolean {
  return slugOrId === 'autres' || slugOrId === 7;
}

/** Transform classes for project icon images (hover grows from base scale, does not replace it). */
export function getProjectIconScaleClasses(isAutres: boolean): string {
  return isAutres ? AUTRES_SCALE_CLASSES : 'group-hover:scale-110';
}
