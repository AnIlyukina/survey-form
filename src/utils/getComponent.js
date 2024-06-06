import UIInput from "../components/blockTypes/UIInput.vue";
import UIInputDate from "../components/blockTypes/UIInputDate.vue";
import UIInputCheckbox from "../components/blockTypes/UIInputCheckbox.vue";
import UITextarea from "../components/blockTypes/UITextarea.vue";
import UIGrade from "../components/blockTypes/UIGrade.vue";
import Multy from "../components/blockTypes/Multy.vue";
import TextInfo from "../components/blockTypes/TextInfo.vue";

const componentsMap = {
    TEXT: UIInput,
    EMAIL: UIInput,
    INN: UIInput,
    PHONE: UIInput,
    NUMBER: UIInput,
    FLOAT: UIInput,
    INTEGER: UIInput,
    DATE: UIInputDate,
    CHECKBOX: UIInputCheckbox,
    RADIO: UIInputCheckbox,
    TEXTAREA: UITextarea,
    GRADE: UIGrade,
    MULTY: Multy,
    INFO: TextInfo
};

export const getComponent = (type) => componentsMap[type];