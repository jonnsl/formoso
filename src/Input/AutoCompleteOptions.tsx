
import React from "react"

type AutoCompleteOptionsProps = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>

function AutoCompleteOptions (props: AutoCompleteOptionsProps): React.ReactNode {
  return (
    <select {...props}>
      <option value="">(Default)</option>
      <option value="off">off</option>
      <option value="on">on</option>
      <option value="name">name</option>
      <option value="honorific-prefix">honorific-prefix</option>
      <option value="given-name">given-name</option>
      <option value="additional-name">additional-name</option>
      <option value="family-name">family-name</option>
      <option value="honorific-suffix">honorific-suffix</option>
      <option value="nickname">nickname</option>
      <option value="email">email</option>
      <option value="username">username</option>
      <option value="new-password">new-password</option>
      <option value="current-password">current-password</option>
      <option value="one-time-code">one-time-code</option>
      <option value="organization-title">organization-title</option>
      <option value="organization">organization</option>
      <option value="street-address">street-address</option>
      <option value="address-line1">address-line1</option>
      <option value="address-level4">address-level4</option>
      <option value="address-level3">address-level3</option>
      <option value="address-level2">address-level2</option>
      <option value="address-level1">address-level1</option>
      <option value="country">country</option>
      <option value="country-name">country-name</option>
      <option value="postal-code">postal-code</option>
      <option value="cc-name">cc-name</option>
      <option value="cc-given-name">cc-given-name</option>
      <option value="cc-additional-name">cc-additional-name</option>
      <option value="cc-family-name">cc-family-name</option>
      <option value="cc-number">cc-number</option>
      <option value="cc-exp">cc-exp</option>
      <option value="cc-exp-month">cc-exp-month</option>
      <option value="cc-exp-year">cc-exp-year</option>
      <option value="cc-csc">cc-csc</option>
      <option value="cc-type">cc-type</option>
      <option value="transaction-currency">transaction-currency</option>
      <option value="transaction-amount">transaction-amount</option>
      <option value="language">language</option>
      <option value="bday">bday</option>
      <option value="bday-day">bday-day</option>
      <option value="bday-month">bday-month</option>
      <option value="bday-year">bday-year</option>
      <option value="sex">sex</option>
      <option value="tel">tel</option>
      <option value="tel-country-code">tel-country-code</option>
      <option value="tel-national">tel-national</option>
      <option value="tel-area-code">tel-area-code</option>
      <option value="tel-local">tel-local</option>
      <option value="tel-extension">tel-extension</option>
      <option value="impp">impp</option>
      <option value="url">url</option>
      <option value="photo">photo</option>
    </select>
  )
}
