/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import BaseLocalizedText from "../../Services/BaseLocalizedText";

export default class LocalizedText extends BaseLocalizedText {
  public static singleton = new LocalizedText();

  public get endOfReport() {
    return this.translate("Errors Report End Of Report");
  }

  public get noOutagesTitle() {
    return this.translate("Errors Report No Outages Title");
  }

  public get noOutagesSubTitle() {
    return this.translate("Errors Report No Outages SubTitle");
  }
}
