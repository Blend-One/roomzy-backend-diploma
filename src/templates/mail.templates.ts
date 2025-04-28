export const mailTemplate = (title: string, content: string) => {
    return (
        '<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">\n' +
        '<head>\n' +
        '<!--[if gte mso 9]>\n' +
        '<xml>\n' +
        '  <o:OfficeDocumentSettings>\n' +
        '    <o:AllowPNG/>\n' +
        '    <o:PixelsPerInch>96</o:PixelsPerInch>\n' +
        '  </o:OfficeDocumentSettings>\n' +
        '</xml>\n' +
        '<![endif]-->\n' +
        '  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n' +
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
        '  <meta name="x-apple-disable-message-reformatting">\n' +
        '  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->\n' +
        '  <title></title>\n' +
        '  \n' +
        '    <style type="text/css">\n' +
        '      \n' +
        '      @media only screen and (min-width: 620px) {\n' +
        '        .u-row {\n' +
        '          width: 600px !important;\n' +
        '        }\n' +
        '\n' +
        '        .u-row .u-col {\n' +
        '          vertical-align: top;\n' +
        '        }\n' +
        '\n' +
        '        \n' +
        '            .u-row .u-col-100 {\n' +
        '              width: 600px !important;\n' +
        '            }\n' +
        '          \n' +
        '      }\n' +
        '\n' +
        '      @media only screen and (max-width: 620px) {\n' +
        '        .u-row-container {\n' +
        '          max-width: 100% !important;\n' +
        '          padding-left: 0px !important;\n' +
        '          padding-right: 0px !important;\n' +
        '        }\n' +
        '\n' +
        '        .u-row {\n' +
        '          width: 100% !important;\n' +
        '        }\n' +
        '\n' +
        '        .u-row .u-col {\n' +
        '          display: block !important;\n' +
        '          width: 100% !important;\n' +
        '          min-width: 320px !important;\n' +
        '          max-width: 100% !important;\n' +
        '        }\n' +
        '\n' +
        '        .u-row .u-col > div {\n' +
        '          margin: 0 auto;\n' +
        '        }\n' +
        '\n' +
        '\n' +
        '}\n' +
        '    \n' +
        'body{margin:0;padding:0}table,td,tr{border-collapse:collapse;vertical-align:top}p{margin:0}.ie-container table,.mso-container table{table-layout:fixed}*{line-height:inherit}a[x-apple-data-detectors=true]{color:inherit!important;text-decoration:none!important}\n' +
        '\n' +
        '\n' +
        'table, td { color: #7e8f9e; } </style>\n' +
        '  \n' +
        '  \n' +
        '\n' +
        '</head>\n' +
        '\n' +
        '<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #7e8f9e">\n' +
        '  <!--[if IE]><div class="ie-container"><![endif]-->\n' +
        '  <!--[if mso]><div class="mso-container"><![endif]-->\n' +
        '  <table role="presentation" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">\n' +
        '  <tbody>\n' +
        '  <tr style="vertical-align: top">\n' +
        '    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">\n' +
        '    <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->\n' +
        '    \n' +
        '  \n' +
        '  \n' +
        '<div class="u-row-container" style="padding: 0px;background-color: transparent">\n' +
        '  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">\n' +
        '    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">\n' +
        '      <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->\n' +
        '      \n' +
        '<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->\n' +
        '<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">\n' +
        '  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">\n' +
        '  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->\n' +
        '  \n' +
        '<table style="font-family:helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">\n' +
        '  <tbody>\n' +
        '    <tr>\n' +
        '      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:helvetica,sans-serif;" align="left">\n' +
        '        \n' +
        '  <div style="font-family: inherit; font-size: 32px; line-height: 140%; text-align: left; word-wrap: break-word;">\n' +
        `    <p style="line-height: 140%;"><span style="color: rgb(0, 0, 0); line-height: 44.8px;"><strong>${title}</strong></span></p>\n` +
        '  </div>\n' +
        '\n' +
        '      </td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table>\n' +
        '\n' +
        '<table style="font-family:helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">\n' +
        '  <tbody>\n' +
        '    <tr>\n' +
        '      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:helvetica,sans-serif;" align="left">\n' +
        '        \n' +
        '  <div style="font-size: 24px; line-height: 140%; text-align: left; word-wrap: break-word;">\n' +
        `    <p style="line-height: 140%;"><span style="color: rgb(0, 0, 0); line-height: 33.6px;">${content}</span></p>\n` +
        '  </div>\n' +
        '\n' +
        '      </td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table>\n' +
        '\n' +
        '  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n' +
        '  </div>\n' +
        '</div>\n' +
        '<!--[if (mso)|(IE)]></td><![endif]-->\n' +
        '      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  </div>\n' +
        '  \n' +
        '\n' +
        '\n' +
        '    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n' +
        '    </td>\n' +
        '  </tr>\n' +
        '  </tbody>\n' +
        '  </table>\n' +
        '  <!--[if mso]></div><![endif]-->\n' +
        '  <!--[if IE]></div><![endif]-->\n' +
        '</body>\n' +
        '\n' +
        '</html>\n'
    );
};
