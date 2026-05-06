import type { ContainerRect, Slide } from "yet-another-react-lightbox";

export function LightboxSlide({
  slide,
  rect,
}: {
  slide: Slide;
  rect: ContainerRect;
}) {
  let width = 0;
  let height = 0;
  let paddingBottom = "work" in slide ? 50 : 25;

  if (slide.width != undefined && slide.height != undefined) {
    width = Math.round(
      Math.min(
        rect.width,
        (rect.height / slide.height + paddingBottom) * slide.width,
      ),
    );
    height = Math.round(
      Math.min(
        rect.height,
        (rect.width / slide.width) * slide.height + paddingBottom,
      ),
    );
  }

  return (
    <img
      alt={slide.alt || ""}
      src={slide.src}
      width={width}
      height={height}
      loading="eager"
      style={{
        objectFit: "contain",
        paddingBottom: paddingBottom,
      }}
      draggable={false}
    />
  );
}
