import PresetColorSwatch from "~/components/admin/theme/dashboard/presetColor/presetColorSwatch";
import DragList from "~/components/admin/common/dragList/dragList";
import s from "~/components/admin/theme/adminTheme.module.css";
import { DragListElement, PresetColor } from "~/lib/type";
import { useAdminContext } from "~/components/admin/context/adminProvider";
import { useAlert } from "~/components/admin/context/alertProvider";
import { updatePresetColorsOrder } from "~/server-functions/theme";

export default function PresetColorDashboard() {
  const { themes, presetColors, setPresetColors } = useAdminContext();
  const alert = useAlert();

  const presetColorCountUse = (presetColor: PresetColor): number => {
    let count = 0;
    themes.forEach((theme) => {
      Object.entries(theme).forEach(([key, value]) => {
        if (key.includes("_") && value === presetColor.name) {
          count += 1;
        }
      });
    });
    return count;
  };

  const handleChangeOrder = async (map: Map<number, number>) => {
    const { message, isError, updatedPresetColors } =
      await updatePresetColorsOrder({ data: map });
    if (!isError && updatedPresetColors) setPresetColors(updatedPresetColors);
    alert(message, isError);
  };

  return (
    <section className={s.presetColorDashboard}>
      <DragList
        list={presetColors.map(
          (p: PresetColor) =>
            ({
              id: p.id,
              element: (
                <PresetColorSwatch
                  presetColor={p}
                  count={presetColorCountUse(p)}
                />
              ),
              order: p.displayOrder,
            }) as DragListElement,
        )}
        onChangeOrder={handleChangeOrder}
      />
    </section>
  );
}
