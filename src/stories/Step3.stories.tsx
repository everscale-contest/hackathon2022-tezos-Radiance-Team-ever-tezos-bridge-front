import {configureStore} from "@reduxjs/toolkit";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Provider} from "react-redux";

import Step3Component from "../components/Step3";
import currentStep from "../store/reducers/currentStep";

const store = configureStore({
  preloadedState: {
    currentStep: {
      value: 3,
    },
  },
  reducer: {
    currentStep,
  },
});

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: Step3Component,
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  title: "Steps",
} as ComponentMeta<typeof Step3Component>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Step3Component> = () => (
  <Step3Component />
);

export const Step3 = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Step3.args = {};
