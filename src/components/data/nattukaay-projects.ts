/** Shared Momar project chips: Nattukaay (/sama-naffa) + onboarding E3 / C4. */
export const NATTUKAAY_PROJECTS = [
  {
    slug: 'maison',
    label: 'Maison',
    objectiveId: 1,
    icon: '/figma/e0/nattukaay/maison.png',
  },
  {
    slug: 'etudes',
    label: 'Education',
    objectiveId: 2,
    icon: '/figma/e0/nattukaay/education.png',
  },
  {
    slug: 'business',
    label: 'Business',
    objectiveId: 4,
    icon: '/figma/e0/nattukaay/business.png',
  },
  {
    slug: 'voyage',
    label: 'Voyage',
    objectiveId: 3,
    icon: '/figma/e0/nattukaay/voyage.png',
  },
  {
    slug: 'autres',
    label: 'Ton rêve',
    objectiveId: 7,
    icon: '/figma/e0/nattukaay/ton-reve.png',
  },
] as const;

export type NattukaaySlug = (typeof NATTUKAAY_PROJECTS)[number]['slug'];

export const NATTUKAAY_AMOUNT_MIN = 1_000;
export const NATTUKAAY_AMOUNT_MAX = 2_000_000;
export const NATTUKAAY_AMOUNT_STEP = 1_000;
export const NATTUKAAY_DUREE_MIN = 6;
export const NATTUKAAY_DUREE_MAX = 240;
export const NATTUKAAY_NAME_MAX = 30;
