'use strict';
var a = [1,2,3];
var b = Math.max(...a);
console.log(b);

var str = `
<style>
    <!--
    @page Section1{
        size:A4;
        margin:72.0pt 75pt 72.0pt 75pt;//默认margin值表示的页边距为 上下边距2.54厘米、左右边距3.17厘米
        mso-header-margin:42.55pt;
        mso-footer-margin:49.6pt;
        mso-paper-source:0;
    }
    div.Section1
    {page:Section1;}
  -->
 </style>
`;
console.log(str);

var content = `      <div class='Section1'>
<p style="font-size:18pt; line-height:150%; margin:0pt; orphans:0; text-align:center; widows:0">
    <!-- <span style="font-family:宋体; font-size:18pt; font-weight:bold">s</span> -->
    <span style="font-family:宋体; font-size:18pt; font-weight:bold">公司审核安排方案</span>
</p>
<div style="text-align:center">
    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin:0 auto">
        <tr style="height:27.7pt">
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:50.35pt">
                <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">公司</span>
                    <!-- <span style="font-family:宋体; font-size:10.5pt">{{company}}</span> -->
                </p>
            </td>
            <td colspan="3" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:205.15pt">
                <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">{{company}}</span>
                </p>
            </td>
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:69.55pt">
                <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">DOC编号</span>
                </p>
            </td>
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:74.25pt">
                <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">{{DOCBH}}</span>
                </p>
            </td>
        </tr>
        <tr style="height:39.25pt">
            <td rowspan="2" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:50.35pt">
                <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">审核种类</span>
                </p>
            </td>
            <td colspan="3" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:205.15pt">
                <p style="margin:0pt; orphans:0; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">国际：{{international}}</span>
                </p>
            </td>
            <td rowspan="2" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:69.55pt">
                <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">审核时间</span>
                </p>
            </td>
            <td rowspan="2" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:74.25pt">
                <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">{{verifyTime}}</span>
                </p>
            </td>
        </tr>
        <tr style="height:39.25pt">
            <td colspan="3" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:205.15pt">
                <p style="margin:0pt; orphans:0; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">国内：{{domestic}}</span>
                </p>
            </td>
        </tr>
        <tr style="height:24pt">
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:50.35pt">
                <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">审核地点</span>
                </p>
            </td>
            <td colspan="3" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:205.15pt">
                <p style="margin:0pt; orphans:0; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">{{verifyAddress}}</span>
                </p>
            </td>
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:69.55pt">
                <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">代表船及审核种类</span>
                </p>
            </td>
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:74.25pt">
                <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">{{delegateAndType}}</span>
                </p>
            </td>
        </tr>
        <tr style="height:26.85pt" id='shzcy'>
        </tr>
        <tr style="height:166pt">
            <td colspan="6" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:top; width:431.7pt">
                <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">具体日程安排及相关说明：</span>
                </p>
                <p style="font-size:10.5pt; line-height:150%; margin:0pt; orphans:0; text-align:justify; widows:0">
                    <span style="font-family:宋体; font-size:10.5pt">{{schedulingProgram}}</span>
                </p>
            </td>
        </tr>
        <tr style="height:0pt">
            <td style="width:61.15pt; border:none"></td>
            <td style="width:80.1pt; border:none"></td>
            <td style="width:55pt; border:none"></td>
            <td style="width:80.85pt; border:none"></td>
            <td style="width:80.35pt; border:none"></td>
            <td style="width:85.05pt; border:none"></td>
        </tr>
    </table>
</div>
<p style="margin:0pt; text-indent:3.35pt">
    <span style="font-family:宋体; font-size:10.5pt">制定人：{{person}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <span style="font-family:宋体; font-size:10.5pt">联系电话：{{phoneNumber}} &nbsp;&nbsp;&nbsp;&nbsp; </span>
    <span style="font-family:宋体; font-size:10.5pt">{{year}}年{{M}}月{{D}}日</span>
</p>
<p style="margin:0pt; text-indent:3.35pt">
    <span style="font-family:宋体; font-size:10.5pt">&nbsp;</span>
</p>
<p style="margin:0pt; text-indent:3.25pt">
    <span style="font-family:仿宋_GB2312; font-size:10.5pt">（注：1.“审核种类”应同时备注审核所覆盖船舶的国籍及船种，若为年度审核，则还应标明审核次数。如“国际：第2次年度审核（中国籍、中国香港籍散货船、其他货船）”；2.若船舶仅作代表船审核，则“代表船及审核种类”填写船名后备注“仅作代表船”；3.此表盖章后发给公司，各局内部流转程序及方式自定。）</span>
</p>
</div>`;


var shzcyxxHead = ` <tr style="height:26.85pt">
<td rowspan="{{rowspan}}" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:50.35pt">
    <p style="margin:0pt; orphans:0; text-align:center; widows:0">
        <span style="font-family:宋体; font-size:10.5pt">审核组成员</span>
    </p>
</td>
<td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:69.3pt">
    <p style="margin:0pt; orphans:0; text-align:center; widows:0">
        <span style="font-family:宋体; font-size:10.5pt">姓名</span>
    </p>
</td>
<td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:44.2pt">
    <p style="margin:0pt; orphans:0; text-align:center; widows:0">
        <span style="font-family:宋体; font-size:10.5pt">审核身份</span>
    </p>
</td>
<td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:70.05pt">
    <p style="margin:0pt; orphans:0; text-align:center; widows:0">
        <span style="font-family:宋体; font-size:10.5pt">所在单位</span>
    </p>
</td>
<td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:69.55pt">
    <p style="margin:0pt; orphans:0; text-align:center; widows:0">
        <span style="font-family:宋体; font-size:10.5pt">执法证号</span>
    </p>
</td>
<td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:74.25pt">
    <p style="margin:0pt; orphans:0; text-align:center; widows:0">
        <span style="font-family:宋体; font-size:10.5pt">联系电话</span>
    </p>
</td>
</tr>`;

var shzcyxx = ` <tr style="height:26.85pt">
<td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:69.3pt">
    <p style="margin:0pt; orphans:0; text-align:center; widows:0">
        <span style="font-family:宋体; font-size:10.5pt">{{name}}</span>
    </p>
</td>
<td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:44.2pt">
    <p style="margin:0pt; orphans:0; text-align:center; widows:0">
        <span style="font-family:宋体; font-size:10.5pt">{{verifyId}}</span>
    </p>
</td>
<td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:70.05pt">
    <p style="margin:0pt; orphans:0; text-align:center; widows:0">
        <span style="font-family:宋体; font-size:10.5pt">{{verifyUnit}}</span>
    </p>
</td>
<td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:69.55pt">
    <p style="margin:0pt; orphans:0; text-align:center; widows:0">
        <span style="font-family:宋体; font-size:10.5pt">{{lawOfId}}</span>
    </p>
</td>
<td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:1pt; border-left-color:#000000; border-left-style:solid; border-left-width:1pt; border-right-color:#000000; border-right-style:solid; border-right-width:1pt; border-top-color:#000000; border-top-style:solid; border-top-width:1pt; padding-left:4.9pt; padding-right:4.9pt; vertical-align:middle; width:74.25pt">
    <p style="margin:0pt; orphans:0; text-align:center; widows:0">
        <span style="font-family:宋体; font-size:10.5pt">{{phoneNumber}}</span>
    </p>
</td>
</tr>`;