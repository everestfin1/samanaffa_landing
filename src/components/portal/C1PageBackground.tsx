/**
 * Full-viewport C1 background (Momar Figma 10:2760 image fill).
 * Renders behind header + cards; object-fit cover matches Figma CROP.
 */
export default function C1PageBackground() {
  return (
    <div className="c1-bg" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="c1-bg-img"
        src="/figma/c1/dashboard-bg.jpg"
        alt=""
        width={960}
        height={1200}
        decoding="async"
      />
    </div>
  );
}
