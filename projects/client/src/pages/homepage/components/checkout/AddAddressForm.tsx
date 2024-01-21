import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import LabelField from "@/components/input/LabelField"
import CityField from "@/components/input/CityField"
import RecepientField from "@/components/input/RecepientField"
import AddressField from "@/components/input/AddressField"
import NotesField from "@/components/input/NotesField"
import MainCheckboxField from "@/components/input/MainCheckboxField"
import PhoneField from "@/components/input/PhoneField"
import { Trans, useTranslation } from "react-i18next"

type AddAddressForm = {
  isPending: boolean
}
const AddAddressForm = ({ isPending }: AddAddressForm) => {
  const { t } = useTranslation()
  const [tos, setTos] = React.useState(false)

  return (
    <>
      <RecepientField />
      <PhoneField />
      <LabelField />
      <CityField />
      <AddressField />
      <NotesField />
      <MainCheckboxField />
      <div className="flex items-center gap-2 text-xs">
        <Checkbox checked={tos} onCheckedChange={(state) => setTos(!!state)} />
        <label>
          <div className="flex flex-wrap gap-1">
            {t("checkoutPage.addressModal.add.tos.tos1")}
            <b>{t("checkoutPage.addressModal.add.tos.tos2")}</b>
            {t("checkoutPage.addressModal.add.tos.tos3")}
            <b>{t("checkoutPage.addressModal.add.tos.tos4")}</b>
            {t("checkoutPage.addressModal.add.tos.tos5")}
          </div>
        </label>
      </div>
      <div className="flex w-full justify-center">
        <Button
          disabled={!tos || isPending}
          type="submit"
          className="w-[60%] text-lg font-bold lg:py-6 mt-4"
        >
          {isPending && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
          {t("checkoutPage.addressModal.add.submitBtn")}
        </Button>
      </div>
    </>
  )
}

export default AddAddressForm
