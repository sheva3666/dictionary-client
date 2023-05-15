import Dictionary from "../../media/icons/Dictionary.png";
import Plus from "../../media/icons/Plus.png";
import Done from "../../media/icons/Done.png";
import { ROUTES } from "../../constants";

export const ACTIONS = [
  { icon: Plus, text: "Add new word" },
  { icon: Dictionary, text: "Your dictionary", path: ROUTES.dictionary },
  { icon: Done, text: "Knowledge check", path: ROUTES.exercises },
];
