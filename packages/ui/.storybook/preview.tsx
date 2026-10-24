import type { Preview } from "@storybook/react-vite";
import { globalTypes, initialGlobals, withProviders } from "../src/storybook/decorators";
import "./storybook.css";

const preview: Preview = {
  decorators: [withProviders],
  globalTypes,
  initialGlobals,
  parameters: {
    layout: "centered",
    a11y: { test: "error" },
  },
};

export default preview;
