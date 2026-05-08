import { Lightbox as YetLightbox } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/styles.css";
import { Slide, Work } from "~/lib/type";
import { LightboxSlide } from "~/components/image/lightbox/lightboxSlide";
import { getSizeText } from "~/utils/commonUtils";
import { rootRouteId, useRouteContext } from "@tanstack/react-router";

type Props = {
  slides: Slide[];
  index: number;
  onClose: () => void;
  isSmall: boolean;
};

export default function Lightbox({ slides, index, onClose, isSmall }: Props) {
  const { structTheme } = useRouteContext({ from: rootRouteId });
  const noButtonNav = isSmall || slides.length < 2;

  return (
    <YetLightbox
      index={index}
      open={index >= 0}
      close={onClose}
      slides={slides}
      render={{
        slide: LightboxSlide,
        buttonPrev: noButtonNav ? () => null : undefined,
        buttonNext: noButtonNav ? () => null : undefined,
        slideFooter: ({ slide }) => {
          return (
            <>
              {"work" in slide && (
                <LongInfoLightbox work={slide.work as Work} />
              )}
              {"title" in slide && "year" in slide && (
                <InfoLightbox
                  title={slide.title as string}
                  year={slide.year as number}
                />
              )}
            </>
          );
        },
      }}
      styles={{
        container: {
          backgroundColor: structTheme.general.lightbox,
          color: structTheme.general.lightboxText,
          padding: "0px",
        },
        icon: { color: structTheme.general.lightboxText },
      }}
      plugins={[Zoom]}
      zoom={{
        scrollToZoom: true,
      }}
    />
  );
}

const InfoLightbox = ({ title, year }: { title: string; year: number }) => (
  <p
    style={{
      position: "absolute",
      bottom: "5px",
      height: "30px",
      padding: "0 50px",
    }}
  >
    <span>
      <strong>{title}</strong>
    </span>{" "}
    - {year}
  </p>
);

// For gallery Lightbox
const LongInfoLightbox = ({ work }: { work: Work }) => (
  <p
    style={{
      position: "absolute",
      bottom: "5px",
      height: "57px",
      padding: "0 50px",
    }}
  >
    <span>
      <strong>{work.title}</strong>
    </span>
    {` - ${work.technique} - ${getSizeText(work)} - `}
    <time>{new Date(work.date).getFullYear()}</time>
    <br />
    {work.description !== "" && <span>{work.description}</span>}
    {(work.isToSell || work.sold) && <span>{" - "}</span>}
    {work.isToSell && (
      <span>{work.price ? `Prix : ${work.price} euros` : "À vendre"}</span>
    )}
    {work.sold && (
      <span>{work.price ? `Prix : ${work.price} euros - Vendu` : "Vendu"}</span>
    )}
  </p>
);
