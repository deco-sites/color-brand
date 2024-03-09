import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import { invoke } from "deco-sites/color-brand/runtime.ts";
import { ColorInfo } from "deco-sites/color-brand/loaders/colors.ts";

const BrandColorCard = () => {
  const domain = useSignal("");
  const brandColors = useSignal<ColorInfo | null>(null);
  const loading = useSignal(false);

  const fetchBrandColors = async () => {
    loading.value = true;
    brandColors.value = await invoke({
      key: "deco-sites/color-brand/loaders/colors.ts",
      props: { domain: domain.value },
    });
    loading.value = false;
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (domain.value) {
      fetchBrandColors();
    }
  };

  return (
    <div class="container mx-auto p-4">
      <form onSubmit={handleSubmit} class="flex gap-2">
        <input
          type="text"
          placeholder="Enter a domain"
          class="input input-bordered w-full max-w-xs"
          value={domain.value}
          onInput={(
            e: JSX.TargetedEvent<HTMLInputElement>,
          ) => (domain.value = e?.currentTarget?.value)}
        />
        <button
          type="submit"
          class="btn btn-primary"
          disabled={loading.value}
        >
          {loading.value ? "Loading..." : "Fetch Colors"}
        </button>
      </form>
      {brandColors.value && (
        <div class="card w-96 bg-base-100 shadow-xl my-4">
          <div class="card-body gap-4">
            <h2 class="card-title">
              <img
                src={brandColors.value?.faviconUrl}
                alt="Favicon"
                class="w-8 h-8 rounded-full"
              />
              {brandColors.value?.domain}
            </h2>
            <div
              class="primary-color p-4 rounded-lg"
              style={{
                backgroundColor: brandColors.value.colors.primary.hex,
                color: brandColors.value.colors.primary.isDark
                  ? "white"
                  : "black",
              }}
            >
              <p>Primary Color: {brandColors.value?.colors.primary.hex}</p>
            </div>
            <div
              class="secondary-color p-4 rounded-lg"
              style={{
                backgroundColor: brandColors.value.colors.secondary.hex,
                color: brandColors.value.colors.secondary.isDark
                  ? "white"
                  : "black",
              }}
            >
              <p>Secondary Color: {brandColors.value?.colors.secondary.hex}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandColorCard;
