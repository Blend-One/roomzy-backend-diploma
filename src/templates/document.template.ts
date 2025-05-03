export interface DocumentTemplateProps {
    id: string;
    address: string;
    roomType: string;
    area: string;
    issuedDate: string;
    dueDate: string;
    amount: number;
    deposit?: number;
    createdDate: string;
}

export const documentXMLTemplate = (props: DocumentTemplateProps) =>
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rentalAgreement>\n' +
    `  <agreementId>${props.id}</agreementId>
` +
    '  \n' +
    '  <landlord>\n' +
    '    <fullName>Ф.И.О</fullName>\n' +
    '    <iin>801212350055</iin>\n' +
    '  </landlord>\n' +
    '\n' +
    '  <tenant>\n' +
    '    <fullName>Ф.И.О</fullName>\n' +
    '    <iin>900101450044</iin>\n' +
    '  </tenant>\n' +
    '\n' +
    '  <property>\n' +
    `    <address>${props.address}
` +
    '    <type>Квартира</type>\n' +
    '    <area>60.5</area>\n' +
    '  </property>\n' +
    '\n' +
    '  <terms>\n' +
    `    <startDate>${props.issuedDate}</startDate>
` +
    `    <endDate>${props.dueDate}</endDate>
` +
    `    <amount>${props.amount}</amount>
` +
    '    <currency>KZT</currency>\n' +
    '  </terms>\n' +
    '\n' +
    '<conditions>\n' +
    `${!!props.deposit ? `<securityDeposit>${props.deposit}</securityDeposit>` : ''}` +
    '    <utilitiesIncluded>false</utilitiesIncluded>\n' +
    '    <sublettingAllowed>false</sublettingAllowed>\n' +
    '  </conditions>\n' +
    '\n' +
    `  <createdAt>${props.createdDate}</createdAt>
` +
    '</rentalAgreement>';

export const documentHTMLTemplate = (data: DocumentTemplateProps) => `
    <html>
    <head><meta charset="UTF-8"><style>
      body { font-family: Arial; line-height: 1.6; padding: 40px; }
      h1 { text-align: center; }
      .section { margin-bottom: 20px; }
    </style></head>
    <body>
      <h1>Договор аренды № ${data.id.slice(0, 6)}</h1>

      <div class="section"><strong>Арендодатель:</strong> Ф.И.О (ИИН: 900101450044)</div>
      <div class="section"><strong>Арендатор:</strong> Ф.И.О (ИИН: 800101450044)</div>

    <div>
      <strong>1. Предмет договора</strong><br>
      Арендодатель предоставляет, а Арендатор принимает во временное владение и пользование помещение, расположенное по адресу: г. Алматы, ул. Абая, д. 10, кв. 15, общей площадью 60.5 кв.м.
    </div>

  <div class="section">
    <strong>2. Срок аренды</strong><br>
    Договор заключён сроком: ${data.issuedDate} - ${data.dueDate}.
  </div>

  <div class="section">
    <strong>3. Арендная плата</strong><br>
    Арендная плата составляет ${data.amount} тенге<br>
    ${!!data.deposit ? `Залог: ${data.deposit} тенге` : ''}
  </div>

  <div class="section">
    <strong>4. Права и обязанности сторон</strong><br>
    <u>Арендодатель обязуется:</u><br>
    — Передать помещение в надлежащем состоянии.<br>
    — Не препятствовать пользованию помещением.<br><br>

    <u>Арендатор обязуется:</u><br>
    — Использовать помещение по назначению.<br>
    — Своевременно оплачивать аренду.<br>
    — Возместить ущерб при порче имущества.<br><br>

    Коммунальные услуги: <strong>не включены</strong><br>
    Субаренда: <strong>не разрешена</strong>
  </div>

  <div class="section">
    <strong>5. Подписи сторон</strong>
  </div>

  <div class="signature">
    <div>
      _________________________<br>
      Ф. И. О.<br>
      (Арендодатель)
    </div>
    <div>
      _________________________<br>
      Ф. И. О..<br>
      (Арендатор)
    </div>
  </div>
    </body>
    </html>
  `;
