import { InjectionKey } from "vue";
import Home from "./src/index.vue";

export { Home };
export default Home;

export * from "./src/instance";

export const postDataUpdateSymbol: InjectionKey<() => void> = Symbol("postDataUpdate");