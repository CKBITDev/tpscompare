import Response from '../responses/response';
import CalendarRepository from '../repositories/calendar-repositoy';
import DateHelper from '../helpers/date-helper';
import AbsentRepository from '../repositories/absent-repositoy';

export default class CalendarController {

    static async loadTglAbsent(req, res) {
        try {

            let dataBody = req.body;

            const year = dataBody.tahun;
            const month = dataBody.bulan;
            const start = `${year}-${month}-01`;
            const end = new Date(year, month, 0).getDate();
            const today = DateHelper.dateNow();
            var dataParse = {
                start: start,
                end: end,
                employee_id: req.auth.employee_id
            };
            var leaveData = await CalendarRepository.leaveData(req, dataParse);
            if (!leaveData.success) {
                return Response.Error(req, res, leaveData.message);
            }
            leaveData = leaveData.data;
            let dateLeave = [];
            for (let index = 0; index < leaveData.length; index++) {
                const leave = leaveData[index];
                const days = leave.days;
                const fromDate = leave.date_from;
                const dateTo = leave.date_to;
                const whereHolidayType = "AND holiday_type_id = 'DAY'";
                if (leave.leave_type_id == 'MAT') {
                    // whereHolidayType = "AND (holiday_type_id = 'DAY' OR (holiday_type_id = 'PUB' AND holiday_description = 'Week End'))";
                }
                var dataParse = {
                    days: days,
                    fromDate: fromDate,
                    dateTo: dateTo,
                    whereHolidayType: whereHolidayType,
                    employee_id: req.auth.employee_id
                };

                var workingDays = await CalendarRepository.workingDayData(req, dataParse);
                workingDays = workingDays.data;
                for (let index2 = 0; index2 < workingDays.length; index2++) {
                    const workDay = workingDays[index2];
                    dateLeave.push(workDay.holiday_date);
                }

            }
            var dataParse = {
                month: month,
                year: year,
                employee_id: req.auth.employee_id
            };
            let data = [];
            var eventData = await CalendarRepository.eventData(req, dataParse);
            if (!eventData.success) {
                return Response.Error(req, res, leaveData.message);
            }
            eventData = eventData.data;
            for (let index = 0; index < eventData.length; index++) {
                const eventResult = eventData[index];
                const holDate = parseInt(eventResult.holiday_date.substring(5, 7));
                if (month == holDate) {
                    let title = '';
                    let color = '';
                    let background = '';

                    if (dateLeave.includes(eventResult.holiday_date)) {
                        title = 'CUTI';
                        color = '#5cd2bd';
                        background = '#fce768';
                    } else if (eventResult.ApprovalStatus === 2) {
                        title = 'RJC';
                        color = '#FF9800';
                        background = '#FF9800';
                    } else if (['DAY', 'PUB', 'CBS'].includes(eventResult.holiday_type_id)) {
                        if (!eventResult.IDAbsent) {
                            if (eventResult.holiday_date < today) {
                                if (['PUB', 'CBS'].includes(eventResult.holiday_type_id)) {
                                    title = 'PUB';
                                    color = '#5cd2bd';
                                    background = '#b89b63';
                                } else {
                                    title = 'NOABS';
                                    color = '#FFFF00';
                                    background = '#0A0A0A';
                                }
                            } else if (eventResult.holiday_date === today) {
                                title = 'TDY';
                                color = '#fcf8e3';
                                background = '#fcf8e3';
                            } else {
                                title = '';
                                color = '#E0E0E0';
                                background = '#E0E0E0';
                            }
                        } else {
                            if (eventResult.justificationRemarks != null && eventResult.justificationRemarks != '' && eventResult.justificationDate != '' && eventResult.justificationDate != null) {
                                if (eventResult.ApprovalStatus == 0) {
                                    title = 'WLA';
                                    color = '#a7f997';
                                    background = '#BD1FDB';
                                } else if (eventResult.ApprovalStatus == 1) {
                                    title = 'APP';
                                    color = '#428d55';
                                    background = '#428d55';
                                }
                            } else {
                                let starTime_plus15 = DateHelper.timeFormat(eventResult.StartTime, 15);
                                if (eventResult.TimeAbsent <= starTime_plus15) {
                                    title = 'OTM';
                                    color = '#428d55';
                                    background = '#428d55';
                                }
                            }
                        }
                    }

                    const val_date = DateHelper.monthFormat(eventResult.holiday_date);
                    if (val_date == `${year}-${month}`) {
                        data.push({
                            id: eventResult.IDAbsent,
                            title: title,
                            start: eventResult.holiday_date,
                            color: color,
                            background: background
                        });
                    }
                }

            }


            return Response.Success(res, data);
        } catch (error) {
            return Response.Error(req, res, error.message, true);
        }

    }
    static async addJustification(req, res) {
        try {


            var dataBody = req.body;

            const dateAbsent = dataBody.justificationDate;
            const remark = dataBody.remarks;
            dataBody.employee_id = req.auth.employee_id;
            dataBody.date_absent = dateAbsent;

            var personel = await AbsentRepository.getPersonelData(req, dataBody);
            const empApproval = personel.data.to_userid;

            var absent = await AbsentRepository.getAbsentData(req, dataBody);
            if (absent) {
                const dataParam = {
                    justificationRemarks: remark,
                    justificationDate: DateHelper.dateNow()
                }
                await AbsentRepository.update(req, dataParam, {
                    IdAbsent: absent.data.IdAbsent
                })
            } else {
                //lupa absent
                const dataParam = {
                    EmployeeID: req.auth.employee_id,
                    EmployeeName: req.auth.fullname,
                    DateAbsent: dateAbsent,
                    TypeShft: 'Normal',
                    Desctription: 'Tidak Absent',
                    CreatedDate: DateHelper.dateTimeNow(),
                    CreatedUser: req.auth.employee_id,
                    ApprovalStatus: 0,
                    ApporvalBy: empApproval,
                    justificationRemarks: remark,
                    justificationDate: DateHelper.dateTimeNow(),
                    TypeHP: 1,
                }

                await AbsentRepository.insert(req, dataParam)
            }
            return Response.SuccessMessage(res, "Data berhasil di input");

        } catch (error) {
            return Response.Error(req, res, error.message, true);
        }
    }
}