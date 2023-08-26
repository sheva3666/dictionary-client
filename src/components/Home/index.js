import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { SecondaryButton, PrimaryButton } from "../common/Buttons";
import useStyles from "./styles";

const Home = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const metrics = [
    {
      id: "INCIDENT_TO_RESOLUTION_total_incident_number",
      name: "Total number of created incidents",
      description: "Total number of created incidents",
      signalFragment: "COUNT(case_id)",
      variables: [],
      sourceSystems: [],
      processTypes: ["Incident-to-Resolution"],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_open_incident_number",
      name: "Total number of open incidents",
      description: "Total number of open incidents",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE \n\t(SELECT BOOL_AND(\n NOT event_name IN (${incident_closure_events})))\n)",
      variables: [
        {
          name: "incident_closure_events",
          description:
            "Events defining the closing events of a case, for example 'Close Incident'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: ["Incident-to-Resolution"],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_resolved_incident_number",
      name: "Total number of resolved incidents",
      description: "Total number of resolved incidents",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE \n\t(SELECT BOOL_OR(\n event_name IN (${incident_closure_events})))\n)",
      variables: [
        {
          name: "incident_closure_events",
          description:
            "Events defining the closing events of a case, for example 'Close Incident'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: ["Incident-to-Resolution"],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_avg_response_time",
      name: "Average response time",
      description: "Average time from incident creation to first response",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${response_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${incident_creation_events}))\n   )",
      variables: [
        {
          name: "response_events",
          description:
            "Events defining the response to a recently opened case, for example 'Assign ticket', 'Create ticket'",
          defaultValue: "'Assign Incident to User'",
          defaultValues: ["'Assign Incident to User'"],
        },
        {
          name: "incident_creation_events",
          description:
            "Events defining the start events of a case, for example 'Create Problem', 'Create Incident'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: ["Incident-to-Resolution"],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_avg_resolution_time",
      name: "Average resolution time",
      description: "Average time from incident creation to its resolution",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${resolution_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${incident_creation_events}))\n   )",
      variables: [
        {
          name: "resolution_events",
          description:
            "Events defining the resolution of a case, for example 'Close Incident', 'Mark Incident as Resolved'",
          defaultValue: "'Close Incident', 'Mark Incident as Resolved'",
          defaultValues: ["'Close Incident', 'Mark Incident as Resolved'"],
        },
        {
          name: "incident_creation_events",
          description:
            "Events defining the start events of a case, for example 'Create Problem', 'Create Incident'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: ["Incident-to-Resolution"],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_first_call_resolution_rate",
      name: "First call resolution rate",
      description:
        "Percentage of incidents that are resolved without any rework. Rework is defined here as any case that contains the same event name more than once.",
      signalFragment:
        "COUNT(case_id) FILTER(\n\tWHERE (SELECT COUNT(DISTINCT event_name)) = (SELECT COUNT(event_name))\n\t)",
      variables: [],
      sourceSystems: [],
      processTypes: ["Incident-to-Resolution"],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_itr_sla_breach_ratio",
      name: "SLA breach ratio",
      description: "Percentage of cases that have breached the SLAs",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE \n\t (SELECT BOOL_OR(\n event_name IN (${itr_sla_breach_events})))\n)/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "itr_sla_breach_events",
          description:
            "Events that mark the time when the SLA was breached, for example 'Incident Resolution SLA Breached'",
          defaultValue:
            "'Incident Response SLA Breached','Incident Resolution SLA Breached'",
          defaultValues: [
            "'Incident Response SLA Breached','Incident Resolution SLA Breached'",
          ],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: ["Incident-to-Resolution"],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_avg_ticket_reassignment_rate",
      name: "Average ticket reassignment rate",
      description: "Average number of reassignments per case",
      signalFragment: "(SUM(${incident_reassignments})\n/ COUNT(case_id))",
      variables: [
        {
          name: "incident_reassignments",
          description:
            'Attribute referring to the reassignment count for incidents, for example, in ServiceNow it is called "IncidentReassignmentCount"',
          defaultValue: '"IncidentReassignmentCount"',
          defaultValues: ['"IncidentReassignmentCount"'],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: ["Incident-to-Resolution"],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_avg_rework_rate",
      name: "Average rework rate",
      description: "Percentage of cases with rework",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (${rework_condition}))\n/ COUNT(case_id))\n* 100",
      variables: [
        {
          name: "rework_condition",
          description:
            'Condition defining a rework event, for example "COUNT(event_name) > COUNT(DISTINCT event_name)" and "IncidentReassignmentCount >= 1"',
          defaultValue: '"IncidentReassignmentCount" >= 1',
          defaultValues: ['"IncidentReassignmentCount" >= 1'],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: ["Incident-to-Resolution"],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_high_priority_incident_ratio",
      name: "High priority incident ratio",
      description: "Percentage of cases with high priority",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (${high_priority})) \n/ COUNT(case_id))\n* 100",
      variables: [
        {
          name: "high_priority",
          description:
            'Condition defining cases with high priority, for example "IncidentPriority = 1" or "IncidentCategory = \'Urgent\'"',
          defaultValue:
            '"IncidentPriority" = 1 OR "IncidentCategory" = \'Urgent\'',
          defaultValues: [
            '"IncidentPriority" = 1 OR "IncidentCategory" = \'Urgent\'',
          ],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: ["Incident-to-Resolution"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_opp_expected_revenue_amount",
      name: "Total amount of opportunity expected revenue",
      description:
        "Total amount of the expected revenue considering all opportunities",
      signalFragment: "SUM(${cx_opportunity_expected_revenue})\n",
      variables: [
        {
          name: "cx_opportunity_expected_revenue",
          description:
            'Attribute that identifies a the expected revenue of the opportunity, for example "Opportunity Expected Revenue Amount"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_opp_lost_expected_revenue_amount",
      name: "Total amount of opportunity expected revenue lost",
      description:
        "Total amount of the expected revenue considering only opportunity lost",
      signalFragment:
        "SUM(${cx_opportunity_expected_revenue}) FILTER (\n\tWHERE ${cx_opp_lost_condition})\n",
      variables: [
        {
          name: "cx_opportunity_expected_revenue",
          description:
            'Attribute that identifies a the expected revenue of the opportunity, for example "Opportunity Expected Revenue Amount"',
          defaultValues: [],
        },
        {
          name: "cx_opp_lost_condition",
          description:
            "Condition indicating that an opportunity is lost, for example \"Opportunity Status\" = 'Lost'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_opp_won_expected_revenue_amount",
      name: "Total amount of opportunity expected revenue won",
      description:
        "Total amount of the expected revenue considering only opportunity won",
      signalFragment:
        "SUM(${cx_opportunity_expected_revenue}) FILTER (\n\tWHERE ${cx_opp_won_condition})\n",
      variables: [
        {
          name: "cx_opportunity_expected_revenue",
          description:
            'Attribute that identifies a the expected revenue of the opportunity, for example "Opportunity Expected Revenue Amount"',
          defaultValues: [],
        },
        {
          name: "cx_opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"Opportunity Status\" = 'Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_lead_conversion_rate",
      name: "Lead Conversion Rate",
      description:
        "Percentage of converted lead: ((number of leads converted to opportunities) / (number of leads processed)) X 100",
      signalFragment:
        "COUNT(case_id)\nFILTER(WHERE event_name MATCHES (${cx_lead_converted_events}))/count(case_id) * 100",
      variables: [
        {
          name: "cx_lead_converted_events",
          description:
            "Events that indicating that a lead was converted, for example 'Lead: Converted'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_opp_lost_time",
      name: "Average opportunity lost time",
      description:
        "Average time from creating the opportunity to loosing the opportunity",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) \n\tWHERE event_name IN (${cx_opp_lost_events})) \n\t-\n\t(SELECT FIRST(end_time) \n\tWHERE event_name IN (${cx_opp_created_events}))\n)",
      variables: [
        {
          name: "cx_opp_lost_events",
          description:
            "Events indicating that a opportunity was lost, for example 'Opportunity: Lost'",
          defaultValues: [],
        },
        {
          name: "cx_opp_created_events",
          description:
            "Events indicating that a opportunity was created, for example 'Opportunity: Identify opportunity'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_lead_response_time",
      name: "Average lead response time",
      description: "Average time from lead creation to working on lead",
      signalFragment:
        "AVG(\n\t(SELECT FIRST(end_time) FILTER (\n\t\tWHERE NOT event_name IN (${cx_lead_created_events})))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE event_name IN (${cx_lead_created_events})))\n   )",
      variables: [
        {
          name: "cx_lead_created_events",
          description:
            "Events indicating that a lead was created, for example 'Lead: Open'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_won_opp",
      name: "Total number of won opportunities",
      description: "Total number of won opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${cx_opp_won_condition})\n\t)",
      variables: [
        {
          name: "cx_opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"Opportunity Status\" = 'Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_opp_wo_lead",
      name: "Opportunities without lead",
      description: "Total number of opportunities without lead",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${cx_lead_identifier} IS NULL\n\t)",
      variables: [
        {
          name: "cx_lead_identifier",
          description:
            'Attribute that identifies a lead, for example "Is Lead"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_open_opp",
      name: "Total number of open opportunities",
      description: "Total number of currently open opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_AND( NOT event_name IN (${cx_close_opp_events})))\n\t)",
      variables: [
        {
          name: "cx_close_opp_events",
          description:
            "Events indicating that an opportunity was closed, for example 'Opportunity: Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_lead_converted_w_qualification",
      name: "Leads Converted with Qualification",
      description: "Number of leads converted with qualification",
      signalFragment:
        "count(case_id)\nfilter(WHERE event_name MATCHES(${cx_lead_convert_qualified_events}))",
      variables: [
        {
          name: "cx_lead_convert_qualified_events",
          description:
            "Condition that indicating that a case was converted after being qualified, for example 'Lead: Qualified' ~> 'Lead: Converted'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_closed_opp",
      name: "Total number of closed opportunities",
      description: "Total number of currently closed opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${cx_close_opp_events})))\n\t)",
      variables: [
        {
          name: "cx_close_opp_events",
          description:
            "Events indicating that an opportunity was closed, for example 'Opportunity: Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_win_loss_ratio",
      name: "Win/loss ratio",
      description:
        "Ratio of won to lost opportunities. A value > 1 indicates that there are more opportunities won than lost.",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (${cx_opp_won_condition}))\n)\n/\n(COUNT(case_id) FILTER (\n\tWHERE (${cx_opp_lost_condition}))\n)",
      variables: [
        {
          name: "cx_opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"Opportunity Status\" = 'Won'",
          defaultValues: [],
        },
        {
          name: "cx_opp_lost_condition",
          description:
            "Condition indicating that an opportunity is lost, for example \"Opportunity Status\" = 'Lost'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_lead_conversion_time",
      name: "Average lead conversion time ",
      description: "Average time from lead creation to lead conversion",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) \n\tWHERE event_name IN (${cx_lead_converted_events})) \n\t-\n\t(SELECT FIRST(end_time) \n\tWHERE event_name IN (${cx_lead_created_events}))\n)",
      variables: [
        {
          name: "cx_lead_converted_events",
          description:
            "Events that indicating that a lead was converted, for example 'Lead: Converted'",
          defaultValues: [],
        },
        {
          name: "cx_lead_created_events",
          description:
            "Events indicating that a lead was created, for example 'Lead: Open'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_opp_won_time",
      name: "Average opportunity win time",
      description:
        "Average time from creating the opportunity to winning the opportunity",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) \n\tWHERE event_name IN (${cx_opp_won_events})) \n\t-\n\t(SELECT FIRST(end_time) \n\tWHERE event_name IN (${cx_opp_created_events}))\n)",
      variables: [
        {
          name: "cx_opp_won_events",
          description:
            "Events indicating that a opportunity was won, for example 'Opportunity: Won'",
          defaultValues: [],
        },
        {
          name: "cx_opp_created_events",
          description:
            "Events indicating that a opportunity was created, for example 'Opportunity: Identify opportunity'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_lead_converted_wo_qualification",
      name: "Leads Converted without Qualification",
      description: "Number of leads converted without qualification",
      signalFragment:
        "count(case_id)\nfilter(WHERE event_name MATCHES(${cx_lead_converted_events}))\n-\ncount(case_id)\nfilter(WHERE event_name MATCHES(${cx_lead_convert_qualified_events}))",
      variables: [
        {
          name: "cx_lead_converted_events",
          description:
            "Events that indicating that a lead was converted, for example 'Lead: Converted'",
          defaultValues: [],
        },
        {
          name: "cx_lead_convert_qualified_events",
          description:
            "Condition that indicating that a case was converted after being qualified, for example 'Lead: Qualified' ~> 'Lead: Converted'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_qualified_lead",
      name: "Total number of qualified leads",
      description: "Total number of qualified leads",
      signalFragment:
        "COUNT(CASE_ID) FILTER (\n\tWHERE EVENT_NAME MATCHES (${cx_lead_qualified_events}))\n",
      variables: [
        {
          name: "cx_lead_qualified_events",
          description:
            "Events that indicating that a lead was qualified, for example 'Lead: Qualified'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_lead_converted",
      name: "Total of leads converted",
      description: "Total of leads converted",
      signalFragment:
        "COUNT (CASE_ID) FILTER (WHERE EVENT_NAME MATCHES (${cx_lead_converted_events}))\n",
      variables: [
        {
          name: "cx_lead_converted_events",
          description:
            "Events that indicating that a lead was converted, for example 'Lead: Converted'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_no_touch_opp",
      name: "No-touch Opportunity",
      description: "Percentage of opportunities without interactions",
      signalFragment:
        'COUNT ("case_id") FILTER (\n\tWHERE ${cx_attr_number_tasks} = 0\n      AND ${cx_attr_number_appointments} = 0\n      AND ${cx_attr_number_emails} = 0\n      AND ${cx_attr_number_phone_calls} = 0\n      AND ${cx_attr_number_visits} = 0\n      )\n',
      variables: [
        {
          name: "cx_attr_number_tasks",
          description:
            'Attribute that identifies the number of tasks created for a specific opportunity , for example "Number of Tasks"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_appointments",
          description:
            'Attribute that identifies the number of appointments created for a specific opportunity , for example "Number of Appointments"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_emails",
          description:
            'Attribute that identifies the number of e-mail sent to a customer for a specific opportunity , for example "Number of E-mails"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_phone_calls",
          description:
            'Attribute that identifies the number of phone calls made to a customer for a specific opportunity , for example "Number of Phones"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_visits",
          description:
            'Attribute that identifies the number of visits made to a customer for a specific opportunity , for example "Number of Visits"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_win_ratio",
      name: "Win ratio",
      description:
        "Percentage of won to all the opportunities in the sales cloud system",
      signalFragment:
        "((COUNT(case_id) FILTER (\n\tWHERE (${cx_opp_won_condition}))\n)\n/\n(COUNT(case_id))*100\n)",
      variables: [
        {
          name: "cx_opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"Opportunity Status\" = 'Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_no_touch_opp_won",
      name: "No-touch Won Opportunity",
      description: "Total number of won opportunities without interactions",
      signalFragment:
        'COUNT ("case_id") FILTER (\n\tWHERE ${cx_opp_won_condition}\n      AND ${cx_attr_number_visits} = 0\n      )\n',
      variables: [
        {
          name: "cx_opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"Opportunity Status\" = 'Won'",
          defaultValues: [],
        },
        {
          name: "cx_attr_number_visits",
          description:
            'Attribute that identifies the number of visits made to a customer for a specific opportunity , for example "Number of Visits"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_opp_w_lead",
      name: "Opportunity with leads",
      description:
        "Number of opportunities created as a follow-up of the lead process",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${cx_lead_identifier} IS NOT NULL\n\t)",
      variables: [
        {
          name: "cx_lead_identifier",
          description:
            'Attribute that identifies a lead, for example "Is Lead"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_touchpoint_per_opp",
      name: "Average number of touchpoints per opportunity",
      description:
        "Average number of touchpoints, for example appointments, email, phone calls and task per opportunities ",
      signalFragment:
        "AVG(${cx_attr_number_tasks} +\n    ${cx_attr_number_appointments} +\n    ${cx_attr_number_emails} +\n    ${cx_attr_number_phone_calls} +\n    ${cx_attr_number_visits})\n",
      variables: [
        {
          name: "cx_attr_number_tasks",
          description:
            'Attribute that identifies the number of tasks created for a specific opportunity , for example "Number of Tasks"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_appointments",
          description:
            'Attribute that identifies the number of appointments created for a specific opportunity , for example "Number of Appointments"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_emails",
          description:
            'Attribute that identifies the number of e-mail sent to a customer for a specific opportunity , for example "Number of E-mails"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_phone_calls",
          description:
            'Attribute that identifies the number of phone calls made to a customer for a specific opportunity , for example "Number of Phones"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_visits",
          description:
            'Attribute that identifies the number of visits made to a customer for a specific opportunity , for example "Number of Visits"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_employee_change_opp",
      name: "Average number of employee changes per opportunity",
      description: "Average number of employee changes per opportunity",
      signalFragment: "AVG(${cx_attr_number_employee_changes}) \n",
      variables: [
        {
          name: "cx_attr_number_employee_changes",
          description:
            'Attribute that identifies the number of employee changes for a specific opportunity , for example "Number of Employees Change"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_lead_declined",
      name: "Total of leads declined",
      description: "Total of leads declined or rejected",
      signalFragment:
        "COUNT (CASE_ID) FILTER (WHERE EVENT_NAME MATCHES (${cx_lead_declined_events}))",
      variables: [
        {
          name: "cx_lead_declined_events",
          description:
            "Events that indicating that a lead was declined or rejected, for example 'Lead: Declined'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_contacts_person_opp",
      name: "Average number of contact persons per opportunity ",
      description: "Average number of contact persons per opportunity ",
      signalFragment: "AVG(${cx_attr_number_contacted_people})",
      variables: [
        {
          name: "cx_attr_number_contacted_people",
          description:
            'Attribute that identifies the number of contacted people related a specific opportunity , for example "Number of Contacts"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: ["Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_conformance_level",
      name: "Conformance level",
      description: "Percentage of cases without conformance issues",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT event_name MATCHES ((${no_happy_path_events}))\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "no_happy_path_events",
          description:
            "Events that should not be part of the \"to be\" process. For example: 'Change Meter Reading Data'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_customer_self_readings",
      name: "Number of meter readings performed by customer",
      description:
        "Number of meter readings performed by customer (self-reading)",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\tSELECT BOOL_OR(event_name IN (${obtain_readings_events})\n\t\tAND ${self_reading_condition}))\n\t)",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "self_reading_condition",
          description:
            "Condition defining that the reading was performed by the customer. For example: \"MeterReadingTypeActual\" = 'Customer'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_onsite_readings",
      name: "Number of meter readings performed on-site",
      description: "Number of meter readings performed on-site by utility",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\tSELECT BOOL_OR(event_name IN (${obtain_readings_events})\n\t\tAND ${utility_reading_condition}))\n\t)",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "utility_reading_condition",
          description:
            "Condition defining that the reading was performed by utility. For example: \"MeterReadingTypeActual\" = 'Utility'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_readings_after_invoicing",
      name: "Number of meter reading data obtained after invoicing",
      description:
        "Number of meter reading data obtained after invoicing period",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${obtain_readings_events})))\n\t\tAND ${after_invoicing_condition}\n\t)\n)",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "after_invoicing_condition",
          description:
            'Condition defining that a given event happens after invoicing. For example: LAST(end_time)) > "LastInvoiceBillingKeyDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_non_reachable_smart_meters",
      name: "Number of non-reachable smart meters",
      description:
        "Number of smart meter devices for which no data was transmitted for 10+ days",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE (\n\tSELECT LAST(end_time) FILTER (WHERE event_name IN (${obtain_readings_events}))\n\t-\n\tFIRST(end_time) FILTER (WHERE event_name IN (${create_reading_orders_events}))\n\t) > DURATION ${non_reachable_smart_meters_period}\n)",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "create_reading_orders_events",
          description:
            "Events identifying when meter reading orders are created. For example: 'Create Meter Reading Order'",
          defaultValues: [],
        },
        {
          name: "non_reachable_smart_meters_period",
          description:
            "Reference time period over which a smart meter is considered non-reachable. For example: '10days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_missing_meter_readings",
      name: "Number of missing meter readings",
      description:
        "Number of meter readings for which the scheduled reading date is passed, but no data was obtained",
      signalFragment:
        "COUNT (case_id) FILTER (\n\t\tWHERE ${overdue_reading_date_condition}\n\t\tAND (SELECT BOOL_AND(NOT event_name IN (${obtain_readings_events})))\n\t)",
      variables: [
        {
          name: "overdue_reading_date_condition",
          description:
            'Condition defining that the scheduled reading date passed. For example: "MeterReadingScheduledReadingDate" < NOW()',
          defaultValues: [],
        },
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_ratio_timely_late_readings",
      name: "Ratio between timely and late meter readings",
      description: "Ratio between timely and late meter readings",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${obtain_readings_events})))\n\t\tAND ${timely_meter_reading_condition})\n\t)\n/\nCOUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${obtain_readings_events})))\n\t\tAND ${late_meter_reading_condition})\n\t)\n)*100",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "timely_meter_reading_condition",
          description:
            'Condition defining that the meter reading was done timely compared to the reference event timestamp. For example: LAST(end_time)) <= "MeterReadingScheduledReadingDate"',
          defaultValues: [],
        },
        {
          name: "late_meter_reading_condition",
          description:
            'Condition defining that the meter reading was done late compared to the reference event timestamp. For example: LAST(end_time)) > "MeterReadingScheduledReadingDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_timely_readings_percent",
      name: "Percentage of timely meter readings",
      description: "Percentage of total meter readings completed on-time",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${obtain_readings_events})))\n\t\tAND ${timely_meter_reading_condition})\n\t)\n/\nCOUNT(case_id) *100",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "timely_meter_reading_condition",
          description:
            'Condition defining that the meter reading was done timely compared to the reference event timestamp. For example: LAST(end_time)) <= "MeterReadingScheduledReadingDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_late_readings_percent",
      name: "Percentage of late meter readings",
      description: "Percentage of total meter readings completed late",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${obtain_readings_events})))\n\t\tAND ${late_meter_reading_condition})\n\t)\n/\nCOUNT(case_id) *100",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "late_meter_reading_condition",
          description:
            'Condition defining that the meter reading was done late compared to the reference event timestamp. For example: LAST(end_time)) > "MeterReadingScheduledReadingDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_manual_changes_meter_readings",
      name: "Number of manual changes to meter readings",
      description:
        "Number of manual changes on the obtained meter reading data",
      signalFragment:
        "COUNT(case_id) FILTER (\n\t\tWHERE (SELECT BOOL_OR(event_name IN (${change_readings_events}))\n\t\tAND BOOL_OR(${mtc_manual_changes_condition}))\n\t\t)",
      variables: [
        {
          name: "change_readings_events",
          description:
            "Events identifying when meter readings are changed. For example: 'Change Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "mtc_manual_changes_condition",
          description:
            "Attributes indicating that an event was executed manually. For example: \"EventCreatedByUserType\" = 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_meter_readings_invoice_cancellation",
      name: "Percentage of meter readings with cancellations of invoice or billing",
      description:
        "Percentage of meter readings with cancellations of invoice or billing",
      signalFragment:
        "COUNT(case_id) FILTER (\n\t\tWHERE (SELECT BOOL_OR(event_name IN (${invoice_billing_cancellation_events})))\n\t\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "invoice_billing_cancellation_events",
          description:
            "Events identifying when invoice or billing documents are cancelled. For example: 'Cancel Billing Document','Cancel Invoice Document'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_nr_meter_orders_dunning",
      name: "Number of meter reading orders that resulted in a dunning notice",
      description:
        "Number of meter reading orders that resulted in a dunning notice",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${order_dunning_condition})\n\t)",
      variables: [
        {
          name: "order_dunning_condition",
          description:
            "Condition defining that the meter reading order resulted in a dunning notice. For example: 'Create Meter Reading Order' ~> 'Create Dunning Notice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_percentage_meter_orders_dunning",
      name: "Percentage of meter reading orders that resulted in a dunning notice",
      description:
        "Percentage of meter reading orders that resulted in a dunning notice",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${order_dunning_condition})\n\t)\n/ COUNT(case_id)*100",
      variables: [
        {
          name: "order_dunning_condition",
          description:
            "Condition defining that the meter reading order resulted in a dunning notice. For example: 'Create Meter Reading Order' ~> 'Create Dunning Notice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_nr_meter_orders_paid_after_dunning",
      name: "Number of meter reading orders that were paid after dunning notice",
      description:
        "Number of meter reading orders that were paid after dunning notice",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${order_paid_after_dunning_condition})\n\t)",
      variables: [
        {
          name: "order_paid_after_dunning_condition",
          description:
            "Condition defining that the meter reading order resulted in a dunning notice and afterwards it was paid. For example: 'Create Meter Reading Order' ~> 'Create Dunning Notice' ~> 'Receive Incoming Payment'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_percentage_meter_orders_paid_after_dunning",
      name: "Percentage of meter reading orders that were paid after dunning notice",
      description:
        "Percentage of meter reading orders that were paid after dunning notice",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${order_paid_after_dunning_condition})\n\t)\n/ COUNT(case_id)*100",
      variables: [
        {
          name: "order_paid_after_dunning_condition",
          description:
            "Condition defining that the meter reading order resulted in a dunning notice and afterwards it was paid. For example: 'Create Meter Reading Order' ~> 'Create Dunning Notice' ~> 'Receive Incoming Payment'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_avg_time_create_order_obtain_data",
      name: "Average time from 'Create Meter Reading Order' to 'Obtain Meter Reading Data'",
      description:
        "Average time from meter reading order creation to meter reading data obtained",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${obtain_readings_events}))\n\t-(SELECT FIRST(end_time)\n\tWHERE event_name IN (${create_reading_orders_events}))\n\t)",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "create_reading_orders_events",
          description:
            "Events identifying when meter reading orders are created. For example: 'Create Meter Reading Order'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_value_open_invoices",
      name: "Value of open invoices",
      description: "Value of currently open invoices which were not yet paid",
      signalFragment:
        'SUM("LastInvoiceAmount")\n-\n(SUM("LastInvoiceAmount") FILTER (\n\t\tWHERE (SELECT BOOL_OR(event_name IN (${receive_payment_events})\n\t\tAND NOT event_name IN (${invoice_billing_cancellation_events})))\n\t))',
      variables: [
        {
          name: "receive_payment_events",
          description:
            "Events identifying when an invoice has been cleared. For example: 'Receive Incoming Payment'",
          defaultValues: [],
        },
        {
          name: "invoice_billing_cancellation_events",
          description:
            "Events identifying when invoice or billing documents are cancelled. For example: 'Cancel Billing Document','Cancel Invoice Document'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_volume_overdue_invoices",
      name: "Volume of overdue invoices",
      description:
        "Volume of currently open invoices which were not yet paid and are overdue",
      signalFragment:
        "COUNT(case_id) FILTER (\n\t\tWHERE ${overdue_invoice_condition}\n\t\tAND (SELECT BOOL_AND(NOT event_name IN (${receive_payment_events}, ${invoice_billing_cancellation_events})))\n\t)",
      variables: [
        {
          name: "overdue_invoice_condition",
          description:
            'Condition defining that the invoice due date passed. For example: "LastInvoicePaymentDueDate" < NOW()',
          defaultValues: [],
        },
        {
          name: "receive_payment_events",
          description:
            "Events identifying when an invoice has been cleared. For example: 'Receive Incoming Payment'",
          defaultValues: [],
        },
        {
          name: "invoice_billing_cancellation_events",
          description:
            "Events identifying when invoice or billing documents are cancelled. For example: 'Cancel Billing Document','Cancel Invoice Document'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: ["Meter-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_total_overdue_invoice_amount",
      name: "Total overdue invoice amounts",
      description:
        "Sum of all invoice amounts that are overdue (converted in USD)",
      signalFragment:
        "SUM(${itc_amount_conv}) FILTER(\n\t WHERE (${itc_clearing_date} IS NULL)\n\t\tAND ${itc_due_date} < DATE_TRUNC('day', NOW())\n\t)",
      variables: [
        {
          name: "itc_amount_conv",
          description:
            'Attribute identifying the amount (converted to USD) of an invoice, for example "Inv. Converted USD Amount"',
          defaultValues: [],
        },
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_open_overdue_invoices",
      name: "Number of open overdue invoices",
      description: "Number of invoices that are currently open and overdue",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} IS NULL)\n\t\tAND ${itc_due_date} < DATE_TRUNC('day', NOW())\n)",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_lead_time",
      name: "Average time invoice creation to invoice clearing",
      description:
        "Average time from invoice creation to invoice clearing within a reference period",
      signalFragment:
        "AVG(\n\t(SELECT LAST(${itc_clearing_date}) \n\t\tWHERE ((NOW() - LAST(end_time)) < DURATION ${itc_invoice_clearing_period}))\n\t-(SELECT LAST(${itc_posting_date})\n\t\tWHERE ((NOW() - LAST(end_time)) < DURATION ${itc_invoice_posting_period}))\n\t)",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_invoice_clearing_period",
          description:
            "Reference time period to monitor invoice creation to clearing times within, for example the last 60 weeks: '60weeks'",
          defaultValues: [],
        },
        {
          name: "itc_posting_date",
          description:
            'Attribute identifying the posting date of an invoice, for example "Inv. Posting Document Date"',
          defaultValues: [],
        },
        {
          name: "itc_invoice_posting_period",
          description:
            "Reference time period to monitor clearing of invoices within, for example the last 60 weeks: '60weeks'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_avg_creation_pgi_invoice",
      name: "Average time post goods issue to invoice creation",
      description: "Average time from posting goods issue to invoice creation",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) \n\tWHERE event_name IN (${itc_invoice_creation_events})) \n\t-\n\t(SELECT FIRST(end_time) \n\tWHERE event_name IN (${itc_shipping_events}))\n)",
      variables: [
        {
          name: "itc_invoice_creation_events",
          description:
            "Events identifying the creation of invoice items, for example 'Create Invoice'",
          defaultValues: [],
        },
        {
          name: "itc_shipping_events",
          description:
            "Events identifying that the goods have been shipped, for example 'Record Goods Issue'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_no_payment_rate",
      name: "No payment rate",
      description: "Percentage of overdue invoices from all open invoices",
      signalFragment:
        "COUNT (case_id) FILTER (\n\tWHERE (${itc_clearing_date} IS NULL AND ${itc_due_date} < DATE_TRUNC('day', NOW()))\n\t)\n/ COUNT (case_id) FILTER(\n\tWHERE (${itc_clearing_date} IS NULL)) * 100",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_dunning_rate",
      name: "Dunning rate",
      description: "Percentage of invoices that were dunned",
      signalFragment:
        "COUNT (case_id) FILTER (\n\tWHERE (${itc_dunning_condition})\n\t) / COUNT (case_id) * 100",
      variables: [
        {
          name: "itc_dunning_condition",
          description:
            'Condition defining that an invoice has already been dunned, for example "InvoiceLastDunnedOn" IS NOT NULL',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_automation_rate_inv_clearing",
      name: "Automation rate for invoice clearing",
      description: "Percentage of automated invoice clearing events",
      signalFragment:
        "SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE (event_name IN (${itc_clear_invoice_events})\n\t\t\tAND (${itc_automation_condition})))\n\t)\n)\n/ SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\tWHERE (event_name IN (${itc_clear_invoice_events})))\n\t)\n)\n* 100",
      variables: [
        {
          name: "itc_clear_invoice_events",
          description:
            "Event identifying the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "itc_automation_condition",
          description:
            "Condition indicating that an event was automated, for example \"Event Created By User Type\" <> 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_duration_of_dunning_blocks",
      name: "Duration of dunning blocks",
      description:
        "Average lead time from setting a dunning block to removing the last dunning block",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER \n\t\t(WHERE event_name IN (${itc_remove_dunning_block_events})))\n\t-\n\t(SELECT FIRST(end_time) FILTER\n\t\t(WHERE event_name IN (${itc_set_dunning_block_events})))\n)",
      variables: [
        {
          name: "itc_remove_dunning_block_events",
          description:
            "Event identifying the removal of a dunning block for an invoice, for example 'Remove Dunning Block'",
          defaultValues: [],
        },
        {
          name: "itc_set_dunning_block_events",
          description:
            "Event identifying the setting of a dunning block for an invoice, for example 'Set Dunning Block'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_days_sales_outstanding",
      name: "Days Sales Outstanding (DSO)",
      description:
        "Average number of days to collect revenue, weighted by the invoice value",
      signalFragment:
        "AVG((\n\t(SELECT LAST(${itc_clearing_date})) \n\t\t- (SELECT FIRST(${itc_posting_date})))\n\t*(SELECT LAST(${itc_amount_conv}))\n)",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_posting_date",
          description:
            'Attribute identifying the posting date of an invoice, for example "Inv. Posting Document Date"',
          defaultValues: [],
        },
        {
          name: "itc_amount_conv",
          description:
            'Attribute identifying the amount (converted to USD) of an invoice, for example "Inv. Converted USD Amount"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_late_payment_rate",
      name: "Late payment rate",
      description:
        "Percentage of invoices that were cleared 1 day after their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} - ${itc_due_date} \n\t\t> DURATION ${itc_late_payment_condition})\n)\n/COUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} IS NOT NULL)\n) * 100",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itc_late_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too late",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_early_payment_rate",
      name: "Early payment rate",
      description:
        "Percentage of invoices that were cleared more than 5 days before their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itc_due_date} - ${itc_clearing_date} \n\t\t> DURATION ${itc_early_payment_condition})\n)\n/COUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} IS NOT NULL)\n)* 100",
      variables: [
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_early_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too early",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_on_time_payment_rate",
      name: "On-time payment rate",
      description:
        "Percentage of invoices that were cleared less than 5 days before and no later than 1 day after their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} - ${itc_due_date} \n\t\t< DURATION ${itc_late_payment_condition}\n\tAND ${itc_due_date} - ${itc_clearing_date}\n\t\t< DURATION ${itc_early_payment_condition}\n\t)\n)\n/\nCOUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} IS NOT NULL)\n)\n* 100",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itc_late_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too late",
          defaultValues: [],
        },
        {
          name: "itc_early_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too early",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_no_touch_invoice",
      name: "No-Touch invoice processing rate",
      description: "Percentage of invoices with no change events",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT (event_name MATCHES(${itc_no_touch_condition})) \n\t\tAND (event_name MATCHES(${itc_clear_invoice_events}))\n)\n/ (COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itc_clear_invoice_events}))\n\t)\n* 100",
      variables: [
        {
          name: "itc_no_touch_condition",
          description:
            "Events that need manual intervention on an invoice and contradict the no-touch rate",
          defaultValues: [],
        },
        {
          name: "itc_clear_invoice_events",
          description:
            "Event identifying the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_inv_without_billing_doc",
      name: "Invoices without billing doc from SO",
      description: "Invoices without Billing Document from Sales Order",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(NOT ${itc_billing_doc_to_invoice_events})\n)",
      variables: [
        {
          name: "itc_billing_doc_to_invoice_events",
          description: "Billing Document to Invoice event flow",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_reversed_invoices",
      name: "Percentage of reversed invoices",
      description: "Percentage of invoices that were reversed",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itc_invoice_reversal_events}))\n/\nCOUNT(case_id)\n* 100",
      variables: [
        {
          name: "itc_invoice_reversal_events",
          description:
            "Event identifying the reversal of an invoice, for example 'Reverse Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_baseline_date_changes",
      name: "Percentage of baseline date changes",
      description:
        "Percentage of Baseline Date Changes after the Invoice was posted to SAP",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itc_change_baseline_date})\n\t\tAND event_name MATCHES(${itc_posting_to_baseline_update_events}))\n/\nCOUNT(case_id)\n* 100",
      variables: [
        {
          name: "itc_change_baseline_date",
          description:
            "Events that describe a change in baseline date, for example 'Update Baseline Date'",
          defaultValues: [],
        },
        {
          name: "itc_posting_to_baseline_update_events",
          description: "Invoice Posting to Baseline date changes event flow",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_total_overdue_invoice_amount",
      name: "Total overdue invoice amounts",
      description:
        "Sum of all invoice amounts that are open and overdue (converted to USD)",
      signalFragment:
        "SUM(${itp_amount_conv}) FILTER(\n\t WHERE (${itp_clearing_date} IS NULL)\n\t\tAND ${itp_due_date} < DATE_TRUNC('day', NOW()))",
      variables: [
        {
          name: "itp_amount_conv",
          description:
            'Attribute identifying the amount (converted to USD) of an invoice, for example "Inv. Converted USD Amount"',
          defaultValues: [],
        },
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_open_overdue_invoices",
      name: "Number of open overdue invoices",
      description: "Number of invoices that are currently open and overdue",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date} IS NULL)\n\t\tAND ${itp_due_date} < DATE_TRUNC('day', NOW()))",
      variables: [
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_overdue_ratio",
      name: "Ratio of overdue invoices",
      description: "Percentage of overdue invoices from all open invoices",
      signalFragment:
        "COUNT (case_id) FILTER (\n\tWHERE (${itp_clearing_date} IS NULL AND ${itp_due_date} < DATE_TRUNC('day', NOW()))\n\t)\n/ COUNT (case_id) FILTER(\n\tWHERE (${itp_clearing_date} IS NULL)) * 100",
      variables: [
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_dpo",
      name: "Days Payables Outstanding",
      description:
        "Days Payables Outstanding - Average time from invoice posting to invoice clearing within a reference period",
      signalFragment:
        "AVG(\n\t(SELECT LAST(${itp_clearing_date}) \n\t\tWHERE ((NOW() - LAST(end_time)) < DURATION ${itp_invoice_clearing_period}))\n\t-(SELECT LAST(${itp_posting_date})\n\t\tWHERE ((NOW() - LAST(end_time)) < DURATION ${itp_invoice_posting_period})))",
      variables: [
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_invoice_clearing_period",
          description:
            "Reference time period to monitor invoice creation to clearing times within, for example the last year: '52weeks'",
          defaultValues: [],
        },
        {
          name: "itp_posting_date",
          description:
            'Attribute identifying the posting date of an invoice, for example "Inv. Posting Document Date"',
          defaultValues: [],
        },
        {
          name: "itp_invoice_posting_period",
          description:
            "Reference time period to monitor clearing of invoices within, for example the last year: '52weeks'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_automation_rate_inv_clearing",
      name: "Automation rate for invoice clearing",
      description:
        "Percentage of automated invoice clearing events. For example 'Clear Invoice' events that are not performed by a Dialog user",
      signalFragment:
        "SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE (event_name IN (${itp_clear_invoice_events})\n\t\t\tAND (${itp_automation_condition})))\n\t)\n)\n/ SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\tWHERE (event_name IN (${itp_clear_invoice_events})))\n\t)\n)\n* 100",
      variables: [
        {
          name: "itp_clear_invoice_events",
          description:
            "Event identifying the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "itp_automation_condition",
          description:
            "Condition indicating that an event was automated, for example \"Event Created By User Type\" <> 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_late_payment_rate",
      name: "Late payment rate",
      description:
        "Percentage of invoices that were cleared more than 1 day after their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date} - ${itp_due_date} \n\t\t> DURATION ${itp_late_payment_condition})\n)\n/COUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date} IS NOT NULL)\n) * 100",
      variables: [
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itp_late_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too late, for example '1days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_early_payment_rate",
      name: "Early payment rate",
      description:
        "Percentage of invoices that were cleared more than 5 days before their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_due_date} - ${itp_clearing_date} \n\t\t> DURATION ${itp_early_payment_condition})\n)\n/COUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date} IS NOT NULL)\n)* 100",
      variables: [
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_early_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too early, for example '5days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_on_time_payment_rate",
      name: "On-time payment rate",
      description:
        "Percentage of invoices that were cleared less than 5 days before and no later than 1 day after their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date} - ${itp_due_date} \n\t\t< DURATION ${itp_late_payment_condition}\n\tAND ${itp_due_date} - ${itp_clearing_date}\n\t\t< DURATION ${itp_early_payment_condition}\n\t)\n)\n/\nCOUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date}IS NOT NULL)\n)\n* 100",
      variables: [
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itp_late_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too late, for example '1days'",
          defaultValues: [],
        },
        {
          name: "itp_early_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too early, for example '5days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_reversed_invoices",
      name: "Percentage of reversed invoices",
      description:
        "Percentage of invoices that were reversed counted for example by the number of 'Reverse Invoice' events",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itp_invoice_reversal_events}))\n/\nCOUNT(case_id)\n* 100",
      variables: [
        {
          name: "itp_invoice_reversal_events",
          description:
            "Event identifying the reversal of an invoice, for example 'Reverse Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_avg_gr_creation_posting_invoice",
      name: "Average time of goods receipt to invoice posting",
      description: "Average time from receipt of goods to invoice posting",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) \n\tWHERE event_name IN (${itp_invoice_posting_events})) \n\t-\n\t(SELECT FIRST(end_time) \n\tWHERE event_name IN (${itp_goods_receipt_events})))",
      variables: [
        {
          name: "itp_invoice_posting_events",
          description:
            "Events identifying the posting of invoice items, for example 'Post Invoice'",
          defaultValues: [],
        },
        {
          name: "itp_goods_receipt_events",
          description:
            "Events identifying that the goods have been shipped, for example 'Record Goods Issue'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_dunning_rate",
      name: "Dunning rate",
      description: "Percentage of invoices that were dunned",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_dunning_condition})\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "itp_dunning_condition",
          description:
            'Condition defining that an invoice has been dunned, for example "Last Inv. Item Dunned On" IS NOT NULL',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_duration_of_payment_blocks",
      name: "Duration of payment blocks",
      description:
        "Average lead time from setting a payment block to removing the last one",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER \n\t\t(WHERE event_name IN (${itp_remove_payment_block_events})))\n\t-\n\t(SELECT FIRST(end_time) FILTER\n\t\t(WHERE event_name IN (${itp_set_payment_block_events}))))",
      variables: [
        {
          name: "itp_remove_payment_block_events",
          description:
            "Event identifying the removal of a payment block for an invoice, for example 'Remove Payment Block'",
          defaultValues: [],
        },
        {
          name: "itp_set_payment_block_events",
          description:
            "Event identifying the setting of a payment block for an invoice, for example 'Set Payment Block'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_no_touch_invoice",
      name: "No-Touch invoice processing rate",
      description:
        "Percentage of cleared invoices where no change events occured",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT (event_name MATCHES(${itp_no_touch_condition})) \n\t\tAND (event_name MATCHES(${itp_clear_invoice_events}))\n)\n/ (COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itp_clear_invoice_events}))\n\t)\n* 100",
      variables: [
        {
          name: "itp_no_touch_condition",
          description:
            "Events that need manual intervention on an invoice and contradict the no-touch rate, for example 'Reverse Invoice'",
          defaultValues: [],
        },
        {
          name: "itp_clear_invoice_events",
          description:
            "Event identifying the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_invoices_without_purchase_order",
      name: "Invoices without po",
      description: "Invoices without purchase order",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(NOT ${itp_po_creation_to_invoice_posting})\n)",
      variables: [
        {
          name: "itp_po_creation_to_invoice_posting",
          description:
            "Purchase order creation followed directly or indirectly by invoice posting, for example 'Create Purchase Order'~> 'Post Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_baseline_date_changes",
      name: "Percentage of baseline date changes",
      description:
        "Percentage of Baseline Date Changes after the Invoice was posted",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itp_change_baseline_date})\n\t\tAND event_name MATCHES(${itp_posting_to_baseline_update_events}))\n/\nCOUNT(case_id)\n* 100",
      variables: [
        {
          name: "itp_change_baseline_date",
          description:
            "Events that describe a change in baseline date, for example 'Change Baseline Date'",
          defaultValues: [],
        },
        {
          name: "itp_posting_to_baseline_update_events",
          description:
            "Invoice Posting to Baseline date changes event flow, for example 'Post Invoice'~>'Change Baseline Date'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_missed_cash_discounts",
      name: "Missed cash discounts",
      description: "Amount of cash discounts missed due to late payments",
      signalFragment:
        "SUM(\n\t(${itp_amount_conv} * ${itp_discount_percentage})\n\t-${itp_discount_applied_to_invoice}\n\t)\nFILTER(\n\tWHERE EVENT_NAME MATCHES (${itp_cd_1_missed})\n\t\tOR EVENT_NAME MATCHES (${itp_cd_2_missed})\n\t)",
      variables: [
        {
          name: "itp_amount_conv",
          description:
            'Attribute identifying the amount (converted to USD) of an invoice, for example "Inv. Converted USD Amount"',
          defaultValues: [],
        },
        {
          name: "itp_discount_percentage",
          description:
            'Attribute referring to the maximum percentage discount that can be applied to the total amount of an invoice item, for example "Last Inv. Item Cash Discount Percentage1"',
          defaultValues: [],
        },
        {
          name: "itp_discount_applied_to_invoice",
          description:
            'Attribute referring to the actual cash discount applied when the invoice was paid, for example "Inv. Converted USD Cash Discount Amount"',
          defaultValues: [],
        },
        {
          name: "itp_cd_1_missed",
          description:
            "Order of events identifying that an invoice was paid after the cash discount due date 1, for example 'Cash Discount 1 Due Date passed'~>'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "itp_cd_2_missed",
          description:
            "Order of events identifying that an invoice was paid after the cash discount due date 2, for example 'Cash Discount 2 Due Date passed'~>'Clear Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_two_way_match_rate",
      name: "Two-way match rate",
      description:
        "Percentage of cases where the invoice amount equals the purchase order net order value",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_two_way_match_condition})\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "itp_two_way_match_condition",
          description:
            'Condition identifying invoices with a two-way attribute match, for example "PO Item Total Net Order Value" = "Inv. Amount in Document Currency"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_invoices_without_gr",
      name: "Invoices without goods receipt",
      description: "Total number of invoices without goods receipts",
      signalFragment:
        "COUNT(case_id)\n\tFILTER (WHERE NOT EVENT_NAME  MATCHES (${itp_goods_receipt_events})\n\t\tAND EVENT_NAME  MATCHES (${itp_invoice_posting_events}))",
      variables: [
        {
          name: "itp_goods_receipt_events",
          description:
            "Events identifying that the goods have been shipped, for example 'Record Goods Issue'",
          defaultValues: [],
        },
        {
          name: "itp_invoice_posting_events",
          description:
            "Events identifying the posting of invoice items, for example 'Post Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_payment_block_rate",
      name: "Payment block rate",
      description: "Percentage of all invoices where a payment block was set",
      signalFragment:
        "COUNT(case_id)\n\tFILTER (WHERE event_name MATCHES (${itp_set_payment_block_events}))\n/ COUNT(case_id) \n* 100",
      variables: [
        {
          name: "itp_set_payment_block_events",
          description:
            "Event identifying the setting of a payment block for an invoice, for example 'Set Payment Block'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_parked_invoices",
      name: "Parked invoices",
      description: "Invoices that have been parked before being posted",
      signalFragment:
        "COUNT(case_id) FILTER(\n\tWHERE event_name MATCHES(${itp_parked_invoices}))",
      variables: [
        {
          name: "itp_parked_invoices",
          description:
            "Event that describes invoices that are parked, for example 'Park Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_manual_invoice_posting",
      name: "Manual invoice posting",
      description:
        "Invoices that have been posted manually, for example by a dialog user",
      signalFragment:
        "SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE (event_name IN (${itp_invoice_posting_events})\n\t\t\tAND (${itp_manual_condition})))))",
      variables: [
        {
          name: "itp_invoice_posting_events",
          description:
            "Events identifying the posting of invoice items, for example 'Post Invoice'",
          defaultValues: [],
        },
        {
          name: "itp_manual_condition",
          description:
            "Condition indicating that an event was manual, for example \"Event Created By User Type\" = 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_currently_blocked_invoices",
      name: "Currently blocked invoices",
      description: "Invoices that are currently blocked from being paid",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itp_set_payment_block_events})\n\t\tAND NOT event_name MATCHES(${itp_remove_payment_block_events})\n\t\tAND NOT event_name MATCHES(${itp_clear_invoice_events}))",
      variables: [
        {
          name: "itp_set_payment_block_events",
          description:
            "Event identifying the setting of a payment block for an invoice, for example 'Set Payment Block'",
          defaultValues: [],
        },
        {
          name: "itp_remove_payment_block_events",
          description:
            "Event identifying the removal of a payment block for an invoice, for example 'Remove Payment Block'",
          defaultValues: [],
        },
        {
          name: "itp_clear_invoice_events",
          description:
            "Event identifying the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_payment_terms_differences",
      name: "Payment Terms Differences",
      description:
        "Number of invoices for which the payment terms on the invoice differ from the payment terms on the purchase order",
      signalFragment:
        "COUNT(case_id) FILTER(\n\tWHERE (${itp_invoice_payment_terms}) \n\t\t<> (CASE WHEN ${itp_purchase_order_payment_terms} IS NULL THEN 0 \n\tELSE ${itp_purchase_order_payment_terms} END))",
      variables: [
        {
          name: "itp_invoice_payment_terms",
          description:
            'Attribute referring to the invoice payment terms in days, for example "Last Inv. Item Net Payment Terms Period"',
          defaultValues: [],
        },
        {
          name: "itp_purchase_order_payment_terms",
          description:
            'Attribute referring to the purchase order payment terms in days, for example "Last PO Net Payment Days"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_price_inconsistency_invoice_and_purchase_order",
      name: "Price difference on the invoice compared to the purchase order",
      description:
        "Number of invoices with different prices compared to the purchase order",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_different_price_condition}))",
      variables: [
        {
          name: "itp_different_price_condition",
          description:
            'Condition showing if there are different prices between purchase order and invoice, for example "PO Item Total Net Order Value" \n<> "Inv. Amount in Document Currency"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_automation_remove_payment_block",
      name: "Automatic payment block removal",
      description:
        "Number of invoices where payment blocks where removed by non-dialog users",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${itp_remove_payment_block_events}))\n\t\tAND NOT (${itp_automatic_condition_nested}))",
      variables: [
        {
          name: "itp_remove_payment_block_events",
          description:
            "Event identifying the removal of a payment block for an invoice, for example 'Remove Payment Block'",
          defaultValues: [],
        },
        {
          name: "itp_automatic_condition_nested",
          description:
            "Condition indicating that an event was manual, for example \"Event Created By User Type\" MATCHES('Dialog')",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_purchase_orders_created_after_invoice_receipt",
      name: "Late purchase order creation",
      description:
        "Total number of invoices where the purchase order item was created after the invoice creation",
      signalFragment:
        "COUNT(case_id) FILTER(\n\tWHERE (event_name MATCHES(\n(${itp_incompliant_activity_order}))))",
      variables: [
        {
          name: "itp_incompliant_activity_order",
          description:
            "Order of events identifying that a purchase order was created after the invoice was created by the vendor, for example 'Vendor Creates Invoice' ~> 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_immediate_payment",
      name: "Invoices with immediate payment terms",
      description:
        "Number of invoices where the payment terms (BSEG.ZBD1T) are 0 or NULL",
      signalFragment:
        "COUNT(case_id) FILTER(\n\tWHERE ${itp_cash_discount_terms} IS NULL\n\t\tOR ${itp_cash_discount_terms} = 0)",
      variables: [
        {
          name: "itp_cash_discount_terms",
          description:
            'Terms that determine after which time an invoice needs to be paid, for example "Last Inv. Item Cash Discount Days 1" BSEG.ZBD1t',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_lost_cd_on_early_payment",
      name: "Lost cash discount despite in-time payment",
      description:
        "Amount of lost cash discounts in USD even though the invoice was paid in time for cash discount collection",
      signalFragment:
        "SUM(\n\t(${itp_amount_conv} * ${itp_discount_percentage})\n\t-${itp_discount_applied_to_invoice}\n\t)\nFILTER(\n\tWHERE EVENT_NAME MATCHES (${itp_cd_in_time}))",
      variables: [
        {
          name: "itp_amount_conv",
          description:
            'Attribute identifying the amount (converted to USD) of an invoice, for example "Inv. Converted USD Amount"',
          defaultValues: [],
        },
        {
          name: "itp_discount_percentage",
          description:
            'Attribute referring to the maximum percentage discount that can be applied to the total amount of an invoice item, for example "Last Inv. Item Cash Discount Percentage1"',
          defaultValues: [],
        },
        {
          name: "itp_discount_applied_to_invoice",
          description:
            'Attribute referring to the actual cash discount applied when the invoice was paid, for example "Inv. Converted USD Cash Discount Amount"',
          defaultValues: [],
        },
        {
          name: "itp_cd_in_time",
          description:
            "Order of events identifying that an invoice was paid in time for collection of cash discount 1, for example 'Clear Invoice'~>('Cash Discount 1 Due Date passed'|'Cash Discount 2 Due Date passed')",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Invoice-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_total_nr_open_opp",
      name: "Total number of open opportunities",
      description: "Total number of currently open opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_AND( NOT event_name IN (${close_opp_events})))\n\t)",
      variables: [
        {
          name: "close_opp_events",
          description:
            "Events indicating that an opportunity was closed, for example 'Update Opportunity Stage to: Closed Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_total_nr_closed_opp",
      name: "Total number of closed opportunities",
      description: "Total number of currently closed opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${close_opp_events})))\n\t)",
      variables: [
        {
          name: "close_opp_events",
          description:
            "Events indicating that an opportunity was closed, for example 'Update Opportunity Stage to: Closed Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_total_nr_won_opp",
      name: "Total number of won opportunities",
      description: "Total number of won opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${opp_won_condition})\n\t)",
      variables: [
        {
          name: "opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"OppIsWon\" = 'TRUE'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_win_ratio",
      name: "Win/loss ratio",
      description:
        "Ratio of won to lost opportunities. A value > 1 indicates that there are more opportunities won than lost.",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (${opp_won_condition}))\n)\n/\n(COUNT(case_id) FILTER (\n\tWHERE (${opp_lost_condition}))\n)",
      variables: [
        {
          name: "opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"OppIsWon\" = 'TRUE'",
          defaultValues: [],
        },
        {
          name: "opp_lost_condition",
          description:
            "Condition indicating that an opportunity is lost, for example \"OppIsWon\" = 'FALSE'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_lead_conversion_time",
      name: "Average lead conversion time",
      description: "Average time from lead creation to lead conversion",
      signalFragment:
        "AVG(\n\t${lead_converted_date} - ${lead_created_date}\n   )",
      variables: [
        {
          name: "lead_converted_date",
          description:
            'Attribute that contains the conversion date of a lead, for example "LeadConvertedDate"',
          defaultValues: [],
        },
        {
          name: "lead_created_date",
          description:
            'Attribute containing the creation date of a lead, for example "LeadCreatedDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_lead_response_time",
      name: "Average lead response time",
      description: "Average time from lead creation to working on lead",
      signalFragment:
        "AVG(\n\t(SELECT FIRST(end_time) FILTER (\n\t\tWHERE NOT event_name IN (${lead_created_events})))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE event_name IN (${lead_created_events})))\n   )",
      variables: [
        {
          name: "lead_created_events",
          description:
            "Events indicating that a lead was created, for example 'Create Lead'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_opp_won_time",
      name: "Average opportunity win time",
      description:
        "Average time from creating the opportunity to winning the opportunity",
      signalFragment:
        "AVG(${opp_closed_date} - ${opp_created_date}) FILTER (\n\tWHERE (${opp_won_condition})\n\t)",
      variables: [
        {
          name: "opp_closed_date",
          description:
            'Attribute containing the closing date of an opportunity, for example "OppCloseDate"',
          defaultValues: [],
        },
        {
          name: "opp_created_date",
          description:
            'Attribute containing the creation date of an opportunity, for example "OppCreatedDate"',
          defaultValues: [],
        },
        {
          name: "opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"OppIsWon\" = 'TRUE'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_opp_lost_time",
      name: "Average opportunity lost time",
      description:
        "Average time from creating the opportunity to loosing the opportunity",
      signalFragment:
        "AVG(${opp_closed_date} - ${opp_created_date}) FILTER (\n\tWHERE (${opp_lost_condition})\n\t)",
      variables: [
        {
          name: "opp_closed_date",
          description:
            'Attribute containing the closing date of an opportunity, for example "OppCloseDate"',
          defaultValues: [],
        },
        {
          name: "opp_created_date",
          description:
            'Attribute containing the creation date of an opportunity, for example "OppCreatedDate"',
          defaultValues: [],
        },
        {
          name: "opp_lost_condition",
          description:
            "Condition indicating that an opportunity is lost, for example \"OppIsWon\" = 'FALSE'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_opp_wo_lead",
      name: "Opportunities without lead",
      description: "Total number of opportunities without lead",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${lead_identifier} IS NULL\n\t)",
      variables: [
        {
          name: "lead_identifier",
          description: 'Attribute that identifies a lead, for example "LeadId"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_touchpoints",
      name: "Average touchpoints per case",
      description: "Average number of touchpoints per case",
      signalFragment:
        "AVG((SELECT COUNT(event_name) FILTER (\n\tWHERE event_name IN (${touchpoint_events})))\n\t)",
      variables: [
        {
          name: "touchpoint_events",
          description:
            "Events that describe a touchpoint, for example 'Log Activity: Call', 'Log Activity: Email'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_no_touch_leads",
      name: "No-touch leads",
      description: "Percentage of leads without interactions",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE \n\t\t(SELECT \n\t\t\tBOOL_AND( NOT event_name IN (${touchpoint_events})) \n\t\t\tAND BOOL_OR( event_name IN (${lead_created_events})) \n\t\t)\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "touchpoint_events",
          description:
            "Events that describe a touchpoint, for example 'Log Activity: Call', 'Log Activity: Email'",
          defaultValues: [],
        },
        {
          name: "lead_created_events",
          description:
            "Events indicating that a lead was created, for example 'Create Lead'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_low_touch_conversions",
      name: "Low-touch conversions",
      description:
        "Number of converted leads with less interactions than specified",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE \n\t\t(SELECT COUNT(event_name) FILTER \n\t\t\t(WHERE event_name IN (${touchpoint_events})) \n\t\t) < ${number_of_touchpoints}\n\t\tAND (SELECT BOOL_OR(event_name IN (${conversion_events})) \n\t\t) \n\t)",
      variables: [
        {
          name: "touchpoint_events",
          description:
            "Events that describe a touchpoint, for example 'Log Activity: Call', 'Log Activity: Email'",
          defaultValues: [],
        },
        {
          name: "number_of_touchpoints",
          description:
            'Threshold for classifying a case as "low-touch case", for example 3',
          defaultValues: [],
        },
        {
          name: "conversion_events",
          description:
            "Events indicating that a case was converted, for example 'Update Opportunity Stage to: Closed Won', 'Lead Converted'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote", "Lead-to-Opportunity"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_created_quotes",
      name: "Number of created quotes",
      description: "Number of created quotes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${quote_created})))\n\t)",
      variables: [
        {
          name: "quote_created",
          description:
            "Events indicating that a quote was created, for example 'Create Quote'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_approved_quotes",
      name: "Number of approved quotes",
      description: "Number of approved quotes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${quote_approved})))\n\t)",
      variables: [
        {
          name: "quote_approved",
          description:
            "Events indicating that a quote was approved, for example 'Approve Quote'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_rejected_quotes",
      name: "Number of rejected quotes",
      description: "Number of rejected quotes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${quote_rejected})))\n\t)",
      variables: [
        {
          name: "quote_rejected",
          description:
            "Events indicating that a quote was rejected, for example 'Reject Quote'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_quote_to_close_ratio",
      name: "Quote to close ratio",
      description: "Fraction of quotes that end up as won opportunities.",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${quote_to_opp_condition}))\n/ COUNT(case_id))\n* 100",
      variables: [
        {
          name: "quote_to_opp_condition",
          description:
            "Sequence of events that describes the process of quotes ending up as won opportunities, for example 'Create Quote' ~> 'Update Opportunity Stage to: Closed Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_total_quote_volume",
      name: "Total quote volume",
      description:
        "Total financial volume of quotes provided to potential clients.",
      signalFragment:
        'SUM("OppAmount") FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${quote_created})))\n\t)',
      variables: [
        {
          name: "quote_created",
          description:
            "Events indicating that a quote was created, for example 'Create Quote'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote"],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_quote_volume",
      name: "Average quote volume",
      description:
        "Average financial volume of quotes provided to potential clients.",
      signalFragment:
        'AVG("OppAmount") FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${quote_created})))\n\t)',
      variables: [
        {
          name: "quote_created",
          description:
            "Events indicating that a quote was created, for example 'Create Quote'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: ["Lead-to-Quote"],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_perc_hired_candidates",
      name: "Percentage of Hired Candidates",
      description:
        "Percentage of job applications that result in a hiring event",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\tWHERE event_name IN (${hiring_events}))\n\t> 0)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "hiring_events",
          description:
            "List of events indicating that the job application resulted in a hire (candidate was hired), e.g. 'Hired'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: ["Attract-to-Acquire Talent"],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_hired_candidates",
      name: "Number of Hired Candidates",
      description: "Number of job applications that result in a hiring event",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\tWHERE event_name IN (${hiring_events}))\n\t> 0)",
      variables: [
        {
          name: "hiring_events",
          description:
            "List of events indicating that the job application resulted in a hire (candidate was hired), e.g. 'Hired'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: ["Attract-to-Acquire Talent"],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_avg_time_to_hire",
      name: "Average Time to Hire",
      description:
        "Average Time Between Job Application Received and Candidate Hired",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER (\n\t\tWHERE (event_name IN (${hiring_events}))))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE (event_name IN (${job_application_creation_events}))))\n)",
      variables: [
        {
          name: "hiring_events",
          description:
            "List of events indicating that the job application resulted in a hire (candidate was hired), e.g. 'Hired'",
          defaultValues: [],
        },
        {
          name: "job_application_creation_events",
          description:
            "List of events indicating that the job application was created, e.g. 'Create Job Application'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: ["Attract-to-Acquire Talent"],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_avg_time_to_fill",
      name: "Average Time to Fill",
      description:
        "Average Time Between Job Requisition Created and Position Filled",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER (\n\t\tWHERE (event_name IN (${hiring_events}))))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE (event_name IN (${job_requisition_creation_events}))))\n)",
      variables: [
        {
          name: "hiring_events",
          description:
            "List of events indicating that the job application resulted in a hire (candidate was hired), e.g. 'Hired'",
          defaultValues: [],
        },
        {
          name: "job_requisition_creation_events",
          description:
            "List of events indicating that the job requisition was created, e.g. 'Create Job Requisition'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: ["Attract-to-Acquire Talent"],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_avg_time_to_extend_offer",
      name: "Average Time to Extend Job Offer",
      description:
        "Average Time Between Candidate Selected by Hiring Manager and Offer Extended to Candidate",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER (\n\t\tWHERE (event_name IN (${offer_extended_events}))))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE (event_name IN (${hiring_manager_hired_events}))))\n)",
      variables: [
        {
          name: "offer_extended_events",
          description:
            "List of events indicating that the job offer has been extended to the candidate, e.g. 'Offer Extended'",
          defaultValues: [],
        },
        {
          name: "hiring_manager_hired_events",
          description:
            "List of events indicating that the candidate has been selected by the hiring manager, e.g. 'Prepare Offer'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: ["Attract-to-Acquire Talent"],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_num_open_job_requisitions",
      name: "Number of Open Job Requisitions",
      description:
        "The number of currently open job requisitions, based on the count of unique Job Requisition IDs and their Job Requisition Status",
      signalFragment:
        'COUNT(DISTINCT "Job Requisition ID") FILTER (\n\tWHERE "Job Requisition Status" IN (${job_req_status_open}))',
      variables: [
        {
          name: "job_req_status_open",
          description:
            "List of Job Requisition status entries that indicate a Job Requisition is still open, e.g. 'Open'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: ["Attract-to-Acquire Talent"],
      aggregationType: "CASE",
    },
    {
      id: "avg_cycle_time",
      name: "Average cycle time",
      description:
        "Average cycle time calculated from the first to the last event",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)) - (SELECT FIRST(end_time))\n   )",
      category: "Cycle Time",
      variables: [],
      sourceSystems: [],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "avg_custom_cycle_time",
      name: "Average custom cycle time",
      description:
        "Average cycle time between two events of interest to the user",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER (\n\t\tWHERE (event_name IN (${end_events}))))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE (event_name IN (${start_events}))))\n   )",
      category: "Cycle Time",
      variables: [
        {
          name: "end_events",
          description:
            "Events defining the end point of the process for the cycle time calculation, for example 'Post Goods Issue'",
          defaultValue: "'Assign Incident to User'",
          defaultValues: ["'Assign Incident to User'"],
        },
        {
          name: "start_events",
          description:
            "Events defining the starting point of the process for the cycle time calculation, for example 'Create Sales Order Item'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "avg_cycle_time_open_cases",
      name: "Average cycle time for open cases",
      description: "Average cycle time for all currently open cases",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))) FILTER (\n\t\tWHERE (SELECT FIRST(event_name) FILTER (\n\t\t\tWHERE event_name IN (${closing_events}))) IS NULL\n   )",
      category: "Cycle Time",
      variables: [
        {
          name: "closing_events",
          description:
            "Events defining the closing of a case, for example 'Clear Invoice', 'Update Opportunity Stage to: Closed Won', 'Reject Quote'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "planned_actual_cycle_time_ratio",
      name: "Ratio between planned and actual average cycle time",
      description:
        "Comparison between planned and actual average cycle time: when > 1 then the actual cycle time is smaller than that planned",
      signalFragment:
        "(DURATION ${threshold_cycle_time})/\nAVG(\n\t(\n\t\t(SELECT LAST(end_time) WHERE event_name\n\t\t\tIN (${end_events})\n\t)\n\t-\n(SELECT FIRST(end_time) WHERE event_name\n\t\t\tIN (${start_events})\n)\n)\n )",
      category: "Cycle Time",
      variables: [
        {
          name: "threshold_cycle_time",
          description: "Threshold cycle time, for example '4hours'",
          defaultValue: "'4hours'",
          defaultValues: ["'4hours'"],
        },
        {
          name: "end_events",
          description:
            "Events defining the end point of the process for the cycle time calculation, for example 'Post Goods Issue'",
          defaultValue: "'Assign Incident to User'",
          defaultValues: ["'Assign Incident to User'"],
        },
        {
          name: "start_events",
          description:
            "Events defining the starting point of the process for the cycle time calculation, for example 'Create Sales Order Item'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_timely_execution",
      name: "Percentage of cases executed in less than a given time",
      description:
        "Percentage of cases executed in less than a given time threshold",
      signalFragment:
        "count(case_id)\n\tFILTER (WHERE \n\t\t\t(SELECT LAST(end_time) FILTER (WHERE event_name\n\t\t\tIN (${end_events}))\n\t\t-\n\tFIRST(end_time) FILTER (WHERE event_name\n\t\t\tIN (${start_events}))\n\t\t) < DURATION ${threshold_cycle_time}\n)\n/ COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${end_events})))\n\t) * 100",
      category: "Cycle Time",
      variables: [
        {
          name: "end_events",
          description:
            "Events defining the end point of the process for the cycle time calculation, for example 'Post Goods Issue'",
          defaultValue: "'Assign Incident to User'",
          defaultValues: ["'Assign Incident to User'"],
        },
        {
          name: "start_events",
          description:
            "Events defining the starting point of the process for the cycle time calculation, for example 'Create Sales Order Item'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
        {
          name: "threshold_cycle_time",
          description: "Threshold cycle time, for example '4hours'",
          defaultValue: "'4hours'",
          defaultValues: ["'4hours'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_avg_sales_order_processing_time",
      name: "Average processing time for sales orders",
      description:
        "Average time from the creation of a sales order item to its complete processing",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${processing_completion_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${sales_order_item_creation_events}))\n\t)",
      variables: [
        {
          name: "processing_completion_events",
          description:
            "Events identifying when a sales order is processed, for example 'Sales Order Completely Processed'",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_otc_avg_invoice_payment_time",
      name: "Average invoice payment time",
      description:
        "Average number of days that it takes a company to collect payment after a sale",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${billing_clearing_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${billing_creation_events}))\n\t)\n",
      variables: [
        {
          name: "billing_clearing_events",
          description:
            "Events identifying that an invoice was cleared, for example 'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "billing_creation_events",
          description:
            "Events identifying the creation of invoices, for example 'Create Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_return_rate",
      name: "Return rate",
      description: "Percentage of cases in which an item was returned",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR (event_name ${return_order_events})\n\t))\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "return_order_events",
          description:
            "Events identifying that a sales order was returned, for example 'Create Return Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_on_time_delivery",
      name: "On-time delivery rate",
      description:
        "Percentage of deliveries arriving at their destination before or on the expected date",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\t\tWHERE (${ontime_delivery_condition})) > 0\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${outbound_delivery_creation_events})))\n\t) \n* 100\n",
      variables: [
        {
          name: "ontime_delivery_condition",
          description:
            "Condition defining that a delivery is on time, for example \"DeliveryGoodsMovementOnTime\" = 'Yes'",
          defaultValues: [],
        },
        {
          name: "outbound_delivery_creation_events",
          description:
            "Events identifying that an Outbound Delivery has been created, for example: 'Create Outbound Delivery'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_otc_late_payment_rate",
      name: "Late payment rate",
      description:
        "Percentage of cases where the invoice was cleared after its due date",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\t\tWHERE (${invoice_overdue_condition})) > 0\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${billing_clearing_events})))\n\t) \n* 100\n",
      variables: [
        {
          name: "invoice_overdue_condition",
          description:
            'Condition defining that an invoice was cleared after the due date, for example "InvoiceAccountingClearingDate" > "InvoiceDueDate"',
          defaultValues: [],
        },
        {
          name: "billing_clearing_events",
          description:
            "Events identifying that an invoice was cleared, for example 'Clear Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_no_payment_rate",
      name: "No payment rate",
      description:
        "Percentage of cases where the invoice is overdue and not cleared",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\t\tWHERE ((${open_accounts_receivable_condition})\n\t\t\tAND (${no_payment_condition}))) > 0\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${billing_creation_events})))\n\t) \n* 100\n",
      variables: [
        {
          name: "open_accounts_receivable_condition",
          description:
            'Condition defining that an invoice has not been cleared so far, although it was expected to. For example: NOW() > "InvoiceDueDate"',
          defaultValues: [],
        },
        {
          name: "no_payment_condition",
          description:
            'Condition defining that an invoice was not cleared, for example "InvoiceAccountingClearingDate" IS NULL',
          defaultValues: [],
        },
        {
          name: "billing_creation_events",
          description:
            "Events identifying the creation of invoices, for example 'Create Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_dunning_rate",
      name: "Dunning rate",
      description: "Percentage of cases where the invoice is dunned",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${dunning_condition})\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "dunning_condition",
          description:
            'Condition defining that an invoice has already been dunned, for example "InvoiceLastDunnedOn" IS NOT NULL',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_avg_sales_doc_to_delivery_creation_time",
      name: "Lead time: sales document item creation to delivery creation",
      description:
        "Average lead time from the event 'Create Sales Order Item' to the event 'Create Outbound Delivery'",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${outbound_delivery_creation_events}) AND\n\t\t((NOW() - LAST(end_time)) < DURATION ${outbound_delivery_period})\n\t\t)\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${sales_order_item_creation_events})\n\t\t)\n\t)",
      variables: [
        {
          name: "outbound_delivery_creation_events",
          description:
            "Events identifying that an Outbound Delivery has been created, for example: 'Create Outbound Delivery'",
          defaultValues: [],
        },
        {
          name: "outbound_delivery_period",
          description:
            "Reference time period in which outbound deliveries have been created, counting backward from today, for example: '7days'",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_avg_invoice_creation_clearing_time",
      name: "Lead time: invoice creation to accounts receivable clearing",
      description:
        "Average lead time for items that were cleared within a reference period",
      signalFragment:
        'AVG(\n\t(SELECT LAST("InvoiceAccountingClearingDate") WHERE \n\t\t((NOW() - LAST(end_time)) < DURATION ${invoice_clearing_period}))\n\t-(SELECT FIRST(${invoice_reference_date})WHERE \n\t\t((NOW() - LAST(end_time)) < DURATION ${invoice_posting_period}))\n\t)',
      variables: [
        {
          name: "invoice_clearing_period",
          description:
            "Reference time period to monitor cleared invoices, for example, for invoices that were cleared during last week: '7days'",
          defaultValues: [],
        },
        {
          name: "invoice_reference_date",
          description:
            'Attributes identifying which field of the accounting document is used for the calculation of the lead time, for example: "InvoiceAccountingDocumentDate"',
          defaultValues: [],
        },
        {
          name: "invoice_posting_period",
          description:
            "Reference time period to monitor invoices that have been paid, for example, for payments that have been paid at least 1 day ago: '1days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_rejected_sales_document_items",
      name: "Rejected sales document items",
      description:
        "Number of rejected sales order items that were created within a time period",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${sales_order_item_creation_events})) \n\t\tAND ((NOW() - LAST(end_time)) < DURATION ${sales_order_item_creation_period})\n\t)\n\tAND (SELECT BOOL_OR(event_name = 'Reject Sales Doc Item')\n\t\tAND ((NOW() - LAST(end_time)) < DURATION ${rejected_orders_reference_period}))\n\t)\n)",
      variables: [
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_period",
          description:
            "Reference time period to monitor sales order items that were created, for example, for sales order items that were created during last week: '7days'",
          defaultValues: [],
        },
        {
          name: "rejected_orders_reference_period",
          description:
            "Reference time period to monitor sales order items that were rejected, for example, for sales order items that were rejected during last week: '7days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_return_order_items_created",
      name: "Return order items created",
      description:
        "Number of return order items that were created within a time period",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${sales_order_item_creation_events})) \n\t\tAND ((NOW() - LAST(end_time)) < DURATION ${sales_order_item_creation_period})\n\t)\n\tAND (SELECT BOOL_OR(event_name = 'Create Return Sales Order Item')\n\t\tAND ((NOW() - LAST(end_time)) < DURATION ${returned_orders_reference_period}))\n\t)\n)",
      variables: [
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_period",
          description:
            "Reference time period to monitor sales order items that were created, for example, for sales order items that were created during last week: '7days'",
          defaultValues: [],
        },
        {
          name: "returned_orders_reference_period",
          description:
            "Reference time period to monitor sales order items that were returned, for example, for sales order items that were returned during last week: '7days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_deleted_sales_document_items",
      name: "Deleted sales document items",
      description:
        "Number of deleted items in sales documents within a defined period of time",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\tSELECT BOOL_OR(event_name IN (${delete_sales_order_item_events}))\n\t\tAND NOW() - LAST(end_time) < DURATION ${sales_order_item_deletion_period}\n\t)\n)",
      variables: [
        {
          name: "delete_sales_order_item_events",
          description:
            "Events identifying that a sales order item was deleted, for example: 'Delete Sales Doc Item'",
          defaultValues: [],
        },
        {
          name: "sales_order_item_deletion_period",
          description:
            "Reference time period to monitor sales order items that were deleted, for example, for sales order items that were deleted during last week: '7days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_automation_rate_sales_doc_creation",
      name: "Automation rate: sales document creation",
      description:
        "Percentage of automated sales order creation events within a time period",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${sales_order_doc_creation_events})\n\t\t AND (${otc_automation_condition}))\n\t\t AND ((NOW() - LAST(end_time)) < DURATION ${sales_order_doc_creation_period})) \n\t)\n) / SUM((SELECT COUNT(event_name)))\n* 100",
      variables: [
        {
          name: "sales_order_doc_creation_events",
          description:
            "Events referring to the creation of any sales document, for example: 'Create Sales Order Item', 'Create Contract Item'",
          defaultValues: [],
        },
        {
          name: "otc_automation_condition",
          description:
            "Attributes indicating that an event was automated, for example: \"EventCreatedByUserType\" != 'Dialog'",
          defaultValues: [],
        },
        {
          name: "sales_order_doc_creation_period",
          description:
            "Reference time period to monitor sales order documents that were created, for example, for sales order documents that were created during last week: '7days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_overdue_and_open_ar_items",
      name: "Overdue and open Accounts Receivable items",
      description: "Number of overdue open customer items",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\t\tWHERE (${invoice_overdue_condition} OR ${open_accounts_receivable_condition})) > 0\n\t)",
      variables: [
        {
          name: "invoice_overdue_condition",
          description:
            'Condition defining that an invoice was cleared after the due date, for example "InvoiceAccountingClearingDate" > "InvoiceDueDate"',
          defaultValues: [],
        },
        {
          name: "open_accounts_receivable_condition",
          description:
            'Condition defining that an invoice has not been cleared so far, although it was expected to. For example: NOW() > "InvoiceDueDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_avg_invoice_customer_process_time",
      name: "Average invoice customer process time",
      description:
        "Average time from the posting of goods issue to the creation of an invoice",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) WHERE event_name IN (${billing_creation_events}))\n\t-\n\t(SELECT FIRST(end_time) WHERE event_name IN (${shipping_events}))\n)",
      variables: [
        {
          name: "billing_creation_events",
          description:
            "Events identifying the creation of invoices, for example 'Create Invoice'",
          defaultValues: [],
        },
        {
          name: "shipping_events",
          description:
            "Events identifying that the goods have been shipped, for example 'Post Goods Issue'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_tot_nr_sales_orders",
      name: "Total number of sales orders",
      description: "Total amount of orders on header level",
      signalFragment:
        "COUNT(DISTINCT SalesDocId) FILTER (\n\t WHERE (SELECT BOOL_OR(event_name IN (${sales_order_item_creation_events}))))",
      variables: [
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_no_touch_order_rate",
      name: "No-Touch-Order Rate",
      description:
        "Percentage of “perfect orders” or no-touch orders, i.e. delivered on time, with the right amount and no other changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${processing_completion_events})\n\t\tAND ${ontime_delivery_condition}\n\t\tAND event_name NOT ${otc_change_events})\n\t)\n)/COUNT(case_id)\n* 100",
      variables: [
        {
          name: "processing_completion_events",
          description:
            "Events identifying when a sales order is processed, for example 'Sales Order Completely Processed'",
          defaultValues: [],
        },
        {
          name: "ontime_delivery_condition",
          description:
            "Condition defining that a delivery is on time, for example \"DeliveryGoodsMovementOnTime\" = 'Yes'",
          defaultValues: [],
        },
        {
          name: "otc_change_events",
          description:
            "Events referring to changes made to the sales doc item, for example: 'Change Sales Doc Item Price'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_price_change_rate",
      name: "Price Change Rate",
      description: "Percentage of cases with SD Item price changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name ${price_change_events})))\n/ COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${sales_order_item_creation_events}))))\n* 100",
      variables: [
        {
          name: "price_change_events",
          description:
            "Events referring to price changes made to the sales doc item",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_delivery_change_rate",
      name: "Delivery Change Rate",
      description: "Percentage of cases with SD Item delivery changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name ${update_delivery_events})))\n/ COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${sales_order_item_creation_events}))))\n* 100",
      variables: [
        {
          name: "update_delivery_events",
          description:
            "Events referring to delivery changes made to the sales doc item",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_material_change_rate",
      name: "Material Change Rate",
      description: "Percentage of cases with SD Item material changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${update_material_events}))))\n/ COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${sales_order_item_creation_events}))))\n* 100",
      variables: [
        {
          name: "update_material_events",
          description:
            "Events indicating material changes made to the sales doc item",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_quantity_change_rate",
      name: "Quantity change rate",
      description: "Percentage of cases with SD Item quantity changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${update_quantity_events}))))\n/ COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${sales_order_item_creation_events}))))\n* 100",
      variables: [
        {
          name: "update_quantity_events",
          description:
            "Events indicating quantity changes made to the sales doc item",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Order-to-Cash"],
      aggregationType: "CASE",
    },
    {
      id: "automation_rate",
      name: "Automation rate",
      description: "Percentage of automated events",
      signalFragment:
        "SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE (${automation_condition}))\n\t)\n\t)\n/ SUM((SELECT COUNT(event_name)))\n* 100",
      category: "Automation",
      variables: [
        {
          name: "automation_condition",
          description:
            "Attributes indicating that an event was automated, for example \"EventCreatedByUserType\" != 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA", "SAP_ISU"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "automation_rate_potential",
      name: "Automation rate potential",
      description: "Percentage of events that could be automated",
      signalFragment:
        "SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE (${automation_potential_condition}))\n\t)\n\t)\n/ SUM((SELECT COUNT(event_name)))\n* 100",
      category: "Automation",
      variables: [
        {
          name: "automation_potential_condition",
          description:
            "Attributes indicating that an event was not automated yet or should not be automated, for example \"EventCreatedByUserType\" = 'Dialog' AND (event_name <> 'Create Invoice Item')",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA", "SAP_ISU"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "automation_rate_events",
      name: "Automation rate over events",
      description: "Percentage of automated events",
      signalFragment:
        "count(event_name) FILTER \n(WHERE (${automation_condition})) \n/ count(event_name) * 100",
      category: "Automation",
      variables: [
        {
          name: "automation_condition",
          description:
            "Attributes indicating that an event was automated, for example \"EventCreatedByUserType\" != 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA", "SAP_ISU"],
      processTypes: [],
      aggregationType: "EVENT",
      releaseDate: "2022-12-08",
    },
    {
      id: "avg_nr_changes_per_case",
      name: "Average number of changes per case",
      description: "Average number of change events per case",
      signalFragment:
        "AVG(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE event_name ${change_events})))",
      category: "Changes",
      variables: [
        {
          name: "change_events",
          description:
            "Events referring to changes made to the case, for example ILIKE '%Update%'",
          defaultValue: " = 'Incident On Hold'",
          defaultValues: [" = 'Incident On Hold'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_change_events_per_case",
      name: "Percentage of change events per case",
      description: "Average percentage of change events per case",
      signalFragment:
        "AVG(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE event_name ${change_events})\n\t) / (SELECT COUNT(event_name))\n\t) * 100",
      category: "Changes",
      variables: [
        {
          name: "change_events",
          description:
            "Events referring to changes made to the case, for example ILIKE '%Update%'",
          defaultValue: " = 'Incident On Hold'",
          defaultValues: [" = 'Incident On Hold'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_cases_with_changes",
      name: "Percentage of cases with changes",
      description: "Percentage of cases that contain change events",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name ${change_events})))\n/ COUNT(case_id)\n* 100",
      category: "Changes",
      variables: [
        {
          name: "change_events",
          description:
            "Events referring to changes made to the case, for example ILIKE '%Update%'",
          defaultValue: " = 'Incident On Hold'",
          defaultValues: [" = 'Incident On Hold'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_cases_with_manual_changes",
      name: "Percentage of cases with manual changes",
      description:
        "Percentage of cases that contain change events executed manually",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name ${change_events}) AND BOOL_OR(${manual_changes_condition})))\n/ COUNT(case_id)\n* 100",
      category: "Changes",
      variables: [
        {
          name: "change_events",
          description:
            "Events referring to changes made to the case, for example ILIKE '%Update%'",
          defaultValue: " = 'Incident On Hold'",
          defaultValues: [" = 'Incident On Hold'"],
        },
        {
          name: "manual_changes_condition",
          description:
            "Attributes indicating that an event was executed manually, for example \"EventCreatedByUserType\" = 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA", "SAP_ISU"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "dropout_number",
      name: "Number of dropouts",
      description:
        "Number of cases that were started and not successfully completed",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT LAST(event_name) IN (${dropout_events}))\n   )",
      category: "Dropouts",
      variables: [
        {
          name: "dropout_events",
          description:
            "Events that identify a dropout case, for example 'Reject Quote', 'Update Opportunity Stage to: Dead - No Decision'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "dropout_rate",
      name: "Dropout rate",
      description:
        "Percentage of cases that were started and not successfully completed",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT LAST(event_name) IN (${dropout_events})))\n/ COUNT(case_id)\n* 100",
      category: "Dropouts",
      variables: [
        {
          name: "dropout_events",
          description:
            "Events that identify a dropout case, for example 'Reject Quote', 'Update Opportunity Stage to: Dead - No Decision'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "nr_idle_cases",
      name: "Number of idle cases",
      description:
        "Number of cases that are open long enough to qualify as dropouts",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOW() - (SELECT LAST(end_time)) > DURATION ${dropout_threshold_time}\n\t\tAND (SELECT FIRST(event_name) FILTER (\n\t\t\tWHERE event_name IN (${case_end_events}))) IS NULL\n   )",
      category: "Dropouts",
      variables: [
        {
          name: "dropout_threshold_time",
          description:
            "Time threshold for considering a case as idle, for example '21days'",
          defaultValue: "'21days'",
          defaultValues: ["'21days'"],
        },
        {
          name: "case_end_events",
          description:
            "Events that identify when the case is completed, for example 'Incident Closed', 'Clear Invoice', 'Update Opportunity Stage to: Closed Won'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
      ],
      sourceSystems: [
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ECC",
        "SAP_S4HANA",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "time_spent_on_dropouts",
      name: "Amount of time spent on dropouts ",
      description:
        "Total cycle time of all cases until the last event before dropout",
      signalFragment:
        "SUM(\n\t(SELECT LAST(end_time)) - (SELECT FIRST(end_time))) FILTER (\n\t\tWHERE (SELECT LAST(event_name) IN (${dropout_events}))\n   )",
      category: "Dropouts",
      variables: [
        {
          name: "dropout_events",
          description:
            "Events that identify a dropout case, for example 'Reject Quote', 'Update Opportunity Stage to: Dead - No Decision'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "conformance_level",
      name: "Conformance level",
      description: "Percentage of cases without conformance issues",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${conformance_condition})) \n/ COUNT(case_id) \n* 100",
      category: "Conformance",
      variables: [
        {
          name: "conformance_condition",
          description:
            "Sequence of events that describes the \"to-be\" process, for example, using the MATCHES function syntax ^ 'Create Sales Order Item' ~> 'Create Outbound Delivery Item' ~> 'Clear Invoice' $",
          defaultValue:
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          defaultValues: [
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          ],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SERVICENOW",
        "SALESFORCE",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "non_conformant_cases",
      name: "Non-conformant cases",
      description: "Total number of non-conformant cases",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT (event_name MATCHES(${conformance_condition})))",
      category: "Conformance",
      variables: [
        {
          name: "conformance_condition",
          description:
            "Sequence of events that describes the \"to-be\" process, for example, using the MATCHES function syntax ^ 'Create Sales Order Item' ~> 'Create Outbound Delivery Item' ~> 'Clear Invoice' $",
          defaultValue:
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          defaultValues: [
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          ],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SERVICENOW",
        "SALESFORCE",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "cases_compliance_risk",
      name: "Cases at compliance risk",
      description:
        "Number of cases that might face penalty due to compliance violation",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (NOT event_name MATCHES(${conformance_condition})\n\tAND (SELECT BOOL_OR( event_name IN (${compliance_milestone_events})))\n\tAND (SELECT\n\t\tLAST(end_time) FILTER (WHERE event_name IN (${compliance_end_events}))\n\t\t-\n\t\tFIRST(end_time) FILTER (WHERE event_name IN (${compliance_start_events}))\n\t) < DURATION ${compliance_threshold_time}\n\t)\n)",
      category: "Conformance",
      variables: [
        {
          name: "conformance_condition",
          description:
            "Sequence of events that describes the \"to-be\" process, for example, using the MATCHES function syntax ^ 'Create Sales Order Item' ~> 'Create Outbound Delivery Item' ~> 'Clear Invoice' $",
          defaultValue:
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          defaultValues: [
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          ],
        },
        {
          name: "compliance_milestone_events",
          description:
            "Events through which the case must flow in order to check for compliance, for example 'Post Goods Issue'",
          defaultValue: "'Incident Resolved'",
          defaultValues: ["'Incident Resolved'"],
        },
        {
          name: "compliance_end_events",
          description:
            "Events defining the end point of the process for the compliance check, for example 'Clear Invoice'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
        {
          name: "compliance_start_events",
          description:
            "Events defining the starting point of the process for the compliance check, for example 'Create Sales Order Item'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
        {
          name: "compliance_threshold_time",
          description: "Threshold compliance time, for example '25 days'",
          defaultValue: "'25days'",
          defaultValues: ["'25days'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SERVICENOW",
        "SALESFORCE",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_avg_po_processing_time",
      name: "Average processing time for purchase orders",
      description:
        "Average time from the creation of a purchase order to its acknowledgment",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${po_acknowledgement_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${po_creation_events}))\n   )",
      variables: [
        {
          name: "po_acknowledgement_events",
          description:
            "Events indicating the acknowledgement of a purchase order item, for example 'Receive Order Confirmation'",
          defaultValues: [],
        },
        {
          name: "po_creation_events",
          description:
            "Events indicating the creation of a purchase order, for example 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_avg_pr_confirmation_time",
      name: "Average confirmation time for purchase requisitions",
      description:
        "Average time needed to confirm a purchase requisition by creating a purchase order",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${po_creation_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${pr_creation_events}))\n   )",
      variables: [
        {
          name: "po_creation_events",
          description:
            "Events indicating the creation of a purchase order, for example 'Create PO Item'",
          defaultValues: [],
        },
        {
          name: "pr_creation_events",
          description:
            "Events indicating the creation of a purchase requisition item, for example 'Create PR Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_ptp_avg_invoice_payment_time",
      name: "Average invoice payment time",
      description: "Average time to clear invoices",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${invoice_clearing_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${invoice_receipt_events}))\n   )",
      variables: [
        {
          name: "invoice_clearing_events",
          description:
            "Events indicating the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "invoice_receipt_events",
          description:
            "Events indicating the receipt of an invoice, for example 'Record Invoice Receipt', 'Create FI Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_goods_return_rate",
      name: "Goods return rate",
      description: "Percentage of cases with delivery returns",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\t\tWHERE event_name IN (${return_delivery_events})) > 0\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "return_delivery_events",
          description:
            "Events identifying cases of delivery returns, for example 'Return Delivery via Delivery Note'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_avg_po_to_delivery_time",
      name: "Average time from purchase order to delivery",
      description: "Average time from purchase order to goods receipt",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${goods_receipt_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${po_creation_events}))\n   )",
      variables: [
        {
          name: "goods_receipt_events",
          description:
            "Events identifying the receipt of goods, for example 'Create Goods Receipt'",
          defaultValues: [],
        },
        {
          name: "po_creation_events",
          description:
            "Events indicating the creation of a purchase order, for example 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_ptp_late_payment_rate",
      name: "Late payment rate",
      description:
        "Percentage of cases with late payments. Only cases that are paid are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${late_payment_condition})\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE (${invoice_clearing_date} IS NOT NULL)\n\t)\n* 100",
      variables: [
        {
          name: "late_payment_condition",
          description:
            'Condition that identifies cases with invoices paid late, for example "Last FI Invoice Item Due Date" < "Last FI Invoice Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "invoice_clearing_date",
          description:
            'Attribute referring to the clearing date of an invoice, for example "Last FI Invoice Item Clearing Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_ptp_overdue_payment_rate",
      name: "Overdue payment rate",
      description:
        "Percentage of cases with overdue payments. Only cases that have not been paid yet are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${overdue_payment_condition})\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE (${invoice_clearing_date} IS NULL)\n\t)\n* 100",
      variables: [
        {
          name: "overdue_payment_condition",
          description:
            'Condition that identifies cases with overdue invoices, for example "Last FI Invoice Item Clearing Date" IS NULL AND "Last FI Invoice Item Due Date" < DATE_TRUNC(\'day\', NOW())',
          defaultValues: [],
        },
        {
          name: "invoice_clearing_date",
          description:
            'Attribute referring to the clearing date of an invoice, for example "Last FI Invoice Item Clearing Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_process_compliance",
      name: "Process compliance",
      description: "Percentage of compliant Procure-to-Pay cases",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${ptp_compliant_event_sequence})\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "ptp_compliant_event_sequence",
          description:
            "Sequence of events that fulfil the compliance requirements of a Procure-to-Pay process, for example ^ 'Create PO Item' ~> 'Create Goods Receipt' ~> ('Create FI Invoice'|'Record Invoice Receipt') ~> 'Clear Invoice' $",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_two_way_match_rate",
      name: "Two-way match rate",
      description: "Percentage of purchase orders with a two-way match",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${two_way_match_condition})\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "two_way_match_condition",
          description:
            'Condition identifying cases with a two-way attribute match, for example "PO Item Net Order Value" = "PO Item Total Invoiced Net Amount Document Curr."',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_po_cancellations_rate",
      name: "Cancellation rate of purchase orders",
      description: "Percentage of cases with cancelled purchase order items",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT FIRST(event_name) FILTER (\n\t\t\tWHERE event_name IN (${po_item_cancellation_events}))) IS NOT NULL\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "po_item_cancellation_events",
          description:
            "Events indicating that a purchase order item was cancelled, for example 'Delete PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_late_deliveries",
      name: "Late deliveries cases",
      description:
        "Number of cases with late deliveries. Only cases that have been completely delivered are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${late_delivery_condition}\n\t\tAND ${delivery_completed_condition}\n\t)",
      variables: [
        {
          name: "late_delivery_condition",
          description:
            'Condition identifying cases that are delivered too late, for example DATE_TRUNC(\'day\', "Last GR Creation Date") > "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_late_deliveries_rate",
      name: "Late deliveries rate",
      description:
        "Percentage of cases with late deliveries. Only cases that have been completely delivered are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${late_delivery_condition}\n\t\tAND ${delivery_completed_condition}\n\t)\n/\nCOUNT(case_id) FILTER (\n\tWHERE ${delivery_completed_condition}\n\t)\n* 100",
      variables: [
        {
          name: "late_delivery_condition",
          description:
            'Condition identifying cases that are delivered too late, for example DATE_TRUNC(\'day\', "Last GR Creation Date") > "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_late_deliveries_net_value",
      name: "Late deliveries net value",
      description:
        "Net order value of cases with late deliveries. Only cases that have been completely delivered are considered.",
      signalFragment:
        "SUM(${po_item_net_order_value}) FILTER (\n\tWHERE ${late_delivery_condition}\n\t\tAND ${delivery_completed_condition}\n\t)",
      variables: [
        {
          name: "po_item_net_order_value",
          description:
            'Attribute referring to the net order value of the PO Item, for example "PO Item Net Order Value in USD"',
          defaultValues: [],
        },
        {
          name: "late_delivery_condition",
          description:
            'Condition identifying cases that are delivered too late, for example DATE_TRUNC(\'day\', "Last GR Creation Date") > "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_late_deliveries_delay",
      name: "Average delay of late deliveries",
      description:
        "The average delay time of late deliveries. Only cases that have been completely delivered are considered.",
      signalFragment:
        "AVG(${goods_receipt_date} - ${delivery_due_date}) FILTER (\n\tWHERE ${late_delivery_condition}\n\t\tAND ${delivery_completed_condition}\n\t)",
      variables: [
        {
          name: "goods_receipt_date",
          description:
            "Attribute referring to the date when the goods have been received, for example DATE_TRUNC('day', \"Last GR Creation Date\")",
          defaultValues: [],
        },
        {
          name: "delivery_due_date",
          description:
            'Attribute referring to the date when the delivery is due, for example "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "late_delivery_condition",
          description:
            'Condition identifying cases that are delivered too late, for example DATE_TRUNC(\'day\', "Last GR Creation Date") > "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_on_time_delivery_rate",
      name: "On-Time Delivery rate",
      description:
        "Percentage of cases with on-time deliveries. Only cases that have been completely delivered are considered.",
      signalFragment:
        "(1 - \n\tCOUNT(case_id) FILTER (\n\t\tWHERE ${late_delivery_condition}\n\t\t\tAND ${delivery_completed_condition}\n\t\t)\n\t/\n\tCOUNT(case_id) FILTER (\n\t\tWHERE ${delivery_completed_condition}\n\t\t)\n)\n* 100",
      variables: [
        {
          name: "late_delivery_condition",
          description:
            'Condition identifying cases that are delivered too late, for example DATE_TRUNC(\'day\', "Last GR Creation Date") > "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_overdue_deliveries",
      name: "Overdue deliveries cases",
      description:
        "Number of cases with overdue deliveries. Only cases that have not been (completely) delivered yet are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${overdue_delivery_condition}\n\t)",
      variables: [
        {
          name: "overdue_delivery_condition",
          description:
            'Condition identifying cases with an overdue delivery, for example DATE_TRUNC(\'day\', NOW()) > "PO Item Last Requested Delivery Date"\n\t  AND "PO Item Delivery Completed" IS NULL',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_overdue_deliveries_rate",
      name: "Overdue deliveries rate",
      description:
        "Percentage of cases with overdue deliveries. Only cases that have not been (completely) delivered yet are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${overdue_delivery_condition}\n\t)\n/\nCOUNT(case_id) FILTER (\n\tWHERE (${delivery_completed_condition}) IS NULL\n\t)\n* 100",
      variables: [
        {
          name: "overdue_delivery_condition",
          description:
            'Condition identifying cases with an overdue delivery, for example DATE_TRUNC(\'day\', NOW()) > "PO Item Last Requested Delivery Date"\n\t  AND "PO Item Delivery Completed" IS NULL',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_overdue_deliveries_net_value",
      name: "Overdue deliveries net value",
      description:
        "Net order value of cases with overdue deliveries. Only cases that have not been (completely) delivered yet are considered.",
      signalFragment:
        "SUM(${po_item_net_order_value}) FILTER (\n\tWHERE ${overdue_delivery_condition}\n\t)",
      variables: [
        {
          name: "po_item_net_order_value",
          description:
            'Attribute referring to the net order value of the PO Item, for example "PO Item Net Order Value in USD"',
          defaultValues: [],
        },
        {
          name: "overdue_delivery_condition",
          description:
            'Condition identifying cases with an overdue delivery, for example DATE_TRUNC(\'day\', NOW()) > "PO Item Last Requested Delivery Date"\n\t  AND "PO Item Delivery Completed" IS NULL',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_payment_block_rate",
      name: "Payment block rate",
      description: "Percentage of cases in which a payment block was set",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT FIRST(event_name) FILTER (\n\t\t\tWHERE event_name IN (${payment_block_events}))) IS NOT NULL\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "payment_block_events",
          description:
            "Events indicating that a payment block was set or removed, for example 'Remove Payment Block', 'Set Payment Block'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_maverick_buying_price_changes",
      name: "Maverick Buying - Prices Changes after Goods Receipt",
      description:
        "Total number of cases with price changes that happened after the Goods Receipt had already been registered",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${ptp_maverick_buying_price_change_condition})\n\t)",
      variables: [
        {
          name: "ptp_maverick_buying_price_change_condition",
          description:
            "Event flow indicating that price changes happened after the Goods Receipt event, for example 'Create Goods Receipt' ~> 'Update PO Item Net Price'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_maverick_buying_rate_po_after_invoice",
      name: "Maverick Buying Rate - PO Creation after Invoice Creation",
      description:
        "Percentage of cases in which the PO Item was created after the Invoice, a common indicator for Maverick Buying",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${ptp_maverick_buying_po_after_invoice_condition})\n\t)\n/ COUNT(case_id) * 100",
      variables: [
        {
          name: "ptp_maverick_buying_po_after_invoice_condition",
          description:
            "Event flow indicating that the Purchase Order was created after the receival of the Invoice, for example 'Create FI Invoice' ~> 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_pos_created_after_invoice_receipt",
      name: "POs created after Invoice Receipt",
      description:
        "Total number of cases in which a PO Item has been created after the Invoice Receipt event",
      signalFragment:
        "COUNT(case_id) FILTER\n\t(WHERE (event_name MATCHES(${po_created_after_invoice_receipt})))",
      variables: [
        {
          name: "po_created_after_invoice_receipt",
          description:
            "Event flow indicating the creation of a PO Item after the Invoice has been received, for example ('Create FI Invoice'|'Record Invoice Receipt') ~> 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_no_touch_order_rate",
      name: "No-touch-order rate",
      description:
        "Percentage of no-touch-orders, which are cases that ran without any changes or typical rework events. Automation of events is not considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT (event_name MATCHES (${ptp_change_event_flow})) AND (event_name MATCHES(${goods_receipt_events}))\n\t)\n/ (COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${goods_receipt_events}))\n\t)\n* 100",
      variables: [
        {
          name: "ptp_change_event_flow",
          description:
            "Event flow indicating that change events happened in a case, for example ('Update PR Net Price'|'Send Purchase Order Update'|'Update PO Item Net Price'|'Update Invoice Payment Terms')",
          defaultValues: [],
        },
        {
          name: "goods_receipt_events",
          description:
            "Events identifying the receipt of goods, for example 'Create Goods Receipt'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_invoices_waiting_for_gr",
      name: "Invoices waiting for Goods Receipt",
      description:
        "Total number of cases with Invoices waiting for the Goods Receipt event",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT (event_name MATCHES(${goods_receipt_events}))\n\tAND (event_name MATCHES(${invoice_receipt_event_flow}))\n\t)",
      variables: [
        {
          name: "goods_receipt_events",
          description:
            "Events identifying the receipt of goods, for example 'Create Goods Receipt'",
          defaultValues: [],
        },
        {
          name: "invoice_receipt_event_flow",
          description:
            "Event flow indicating the receipt of an invoice, for example ('Create FI Invoice'|'Record Invoice Receipt')",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_volume_of_cancelled_orders",
      name: "Volume of cancelled orders",
      description: "Volume of orders in USD that have been cancelled",
      signalFragment:
        "SUM(${po_item_net_order_value}) FILTER (\n\tWHERE event_name MATCHES(${po_item_cancellation_events})\n\t)",
      variables: [
        {
          name: "po_item_net_order_value",
          description:
            'Attribute referring to the net order value of the PO Item, for example "PO Item Net Order Value in USD"',
          defaultValues: [],
        },
        {
          name: "po_item_cancellation_events",
          description:
            "Events indicating that a purchase order item was cancelled, for example 'Delete PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_cancellation_of_gr",
      name: "Cancellation of Goods Receipts",
      description:
        "Total number of cases in which a Goods Receipt has been reversed",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${goods_receipt_reversal_events}))\n\tAND (event_name MATCHES(${goods_receipt_events}))\n\t)",
      variables: [
        {
          name: "goods_receipt_reversal_events",
          description:
            "Events identifying the reversal of a Goods Receipt, for example 'Reverse Goods Receipt'",
          defaultValues: [],
        },
        {
          name: "goods_receipt_events",
          description:
            "Events identifying the receipt of goods, for example 'Create Goods Receipt'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_perfect_order_fulfillment_rate",
      name: "Perfect order fulfillment rate",
      description:
        "Percentage of cases that went through without any reversal of Goods Receipts",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${goods_receipt_events}))\n\t)\n\t-\n\tCOUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${goods_receipt_reversal_events}))\n\t))\n\t/\n\tCOUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${goods_receipt_events}))\n\t)\n\t* 100",
      variables: [
        {
          name: "goods_receipt_events",
          description:
            "Events identifying the receipt of goods, for example 'Create Goods Receipt'",
          defaultValues: [],
        },
        {
          name: "goods_receipt_reversal_events",
          description:
            "Events identifying the reversal of a Goods Receipt, for example 'Reverse Goods Receipt'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_po_item_changes_rate",
      name: "PO Item changes rate",
      description: "Percentage of cases with PO Item changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${po_change_event_flow})))\n\t/\n\tCOUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${po_creation_events}))\n\t)\n\t* 100",
      variables: [
        {
          name: "po_change_event_flow",
          description:
            "Events indicating changes to purchase order item, for example 'Update PO Item Net Price'",
          defaultValues: [],
        },
        {
          name: "po_creation_events",
          description:
            "Events indicating the creation of a purchase order, for example 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_late_payments_cycle_time",
      name: "Late payments cycle time",
      description: "Average payment cycle time of cases with late payments",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER \n\t\t(WHERE event_name IN (${invoice_clearing_events})))\n\t-\n\t(SELECT FIRST(end_time) FILTER \n    \t(WHERE event_name IN (${invoice_receipt_events})))\n\t) FILTER (\n\tWHERE (${late_payment_condition})\n\tAND ${invoice_clearing_date} IS NOT NULL\n\t)",
      variables: [
        {
          name: "invoice_clearing_events",
          description:
            "Events indicating the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "invoice_receipt_events",
          description:
            "Events indicating the receipt of an invoice, for example 'Record Invoice Receipt', 'Create FI Invoice'",
          defaultValues: [],
        },
        {
          name: "late_payment_condition",
          description:
            'Condition that identifies cases with invoices paid late, for example "Last FI Invoice Item Due Date" < "Last FI Invoice Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "invoice_clearing_date",
          description:
            'Attribute referring to the clearing date of an invoice, for example "Last FI Invoice Item Clearing Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_invoice_reversal_rate",
      name: "Invoice reversal rate",
      description: "Percentage of cases with reversed invoices",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${invoice_reversal_events})\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${invoice_receipt_event_flow})\n\t)\n* 100",
      variables: [
        {
          name: "invoice_reversal_events",
          description:
            "Events identifying the reversal of an Invoice, for example 'Reverse Invoice'",
          defaultValues: [],
        },
        {
          name: "invoice_receipt_event_flow",
          description:
            "Event flow indicating the receipt of an invoice, for example ('Create FI Invoice'|'Record Invoice Receipt')",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: ["Procure-to-Pay"],
      aggregationType: "CASE",
    },
    {
      id: "avg_nr_reworks_per_case",
      name: "Average number of reworks per case",
      description:
        "Average number, per case, of events that appear at least twice",
      signalFragment:
        "AVG((SELECT COUNT(event_name) - COUNT(DISTINCT event_name)))",
      category: "Rework",
      variables: [],
      sourceSystems: [],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_rework_cases",
      name: "Percentage of cases affected by rework",
      description:
        "Number of cases affected by rework divided by the total number of cases",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE\n\t(SELECT BOOL_OR (${minimum_loops_condition})\n\t\tFROM(SELECT OCCURRENCE(event_name) AS occurrence) AS sub\n)\n)/COUNT(case_id)*100",
      category: "Rework",
      variables: [
        {
          name: "minimum_loops_condition",
          description:
            "Minimum number of multiple occurrences for events to be considered as rework, for example: occurrence > 1",
          defaultValue: "occurrence > 1",
          defaultValues: ["occurrence > 1"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_rework_events",
      name: "Percentage of events affected by rework",
      description:
        "Number of events in the process that appear at least twice divided by the total number of events",
      signalFragment:
        "SUM(\n(SELECT COUNT(event_name) - COUNT(DISTINCT event_name))\n)\n/\nSUM((SELECT COUNT(event_name))) * 100",
      category: "Rework",
      variables: [],
      sourceSystems: [],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "avg_cycle_time_rework_cases",
      name: "Average cycle time for cases affected by rework",
      description:
        "Average cycle time calculated from the first to the last event for cases affected by rework",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n)\n\tFILTER (WHERE (SELECT BOOL_OR (${minimum_loops_condition})\n\t\tFROM(SELECT OCCURRENCE(event_name) AS occurrence) AS sub)\n\t\t)",
      category: "Rework",
      variables: [
        {
          name: "minimum_loops_condition",
          description:
            "Minimum number of multiple occurrences for events to be considered as rework, for example: occurrence > 1",
          defaultValue: "occurrence > 1",
          defaultValues: ["occurrence > 1"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "net_avg_rework_cycle_time",
      name: "Net average cycle time spent on rework",
      description:
        "Difference between the average cycle time of the cases that have any rework and the average cycle time of the whole process",
      signalFragment:
        "(AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n)\n\tFILTER (WHERE (SELECT BOOL_OR (${minimum_loops_condition})\n\t\tFROM(SELECT OCCURRENCE(event_name) AS occurrence) AS sub)\n\t\t))\n-\n(AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n))",
      category: "Rework",
      variables: [
        {
          name: "minimum_loops_condition",
          description:
            "Minimum number of multiple occurrences for events to be considered as rework, for example: occurrence > 1",
          defaultValue: "occurrence > 1",
          defaultValues: ["occurrence > 1"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_cases_no_rework",
      name: "Percentage of cases without any rework",
      description:
        "Number of cases not affected by rework divided by the total number of cases",
      signalFragment:
        "100 - (COUNT(case_id) FILTER (WHERE\n\t(SELECT BOOL_OR (${minimum_loops_condition})\n\t\tFROM (SELECT OCCURRENCE(event_name) AS occurrence) AS sub\n)\n)/COUNT(case_id)*100)",
      category: "Rework",
      variables: [
        {
          name: "minimum_loops_condition",
          description:
            "Minimum number of multiple occurrences for events to be considered as rework, for example: occurrence > 1",
          defaultValue: "occurrence > 1",
          defaultValues: ["occurrence > 1"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "fraction_tot_cycle_time_on_rework",
      name: "Fraction of total average cycle time spent on rework",
      description:
        "Ratio between net average cycle time spent on rework and total average cycle time",
      signalFragment:
        "((AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n\t)\n\tFILTER (WHERE (SELECT BOOL_OR (${minimum_loops_condition})\n\t\tFROM (SELECT OCCURRENCE(event_name) AS occurrence) AS sub)\n\t\t))\n-\n(AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n\t))\n)\n/(AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n\t))",
      category: "Rework",
      variables: [
        {
          name: "minimum_loops_condition",
          description:
            "Minimum number of multiple occurrences for events to be considered as rework, for example: occurrence > 1",
          defaultValue: "occurrence > 1",
          defaultValues: ["occurrence > 1"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "sla_breach_ratio",
      name: "SLA breach ratio on process level, based on SLA events",
      description:
        "Percentage of cases where the SLA was breached, based on events related to SLA breaches",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT FIRST(event_name)\n\t\t\tWHERE event_name IN (${sla_breach_events})) IS NOT NULL)\n/ COUNT(case_id)\n* 100",
      category: "SLAs",
      variables: [
        {
          name: "sla_breach_events",
          description:
            "Events indicating the breach of an SLA, for example 'Incident Resolution SLA Breached'",
          defaultValue:
            "'Incident Resolution SLA Breached','Incident Response SLA Breached'",
          defaultValues: [
            "'Incident Resolution SLA Breached','Incident Response SLA Breached'",
          ],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "sla_violations",
      name: "Number of SLA breaches based on SLA events",
      description:
        "Number of cases where the SLA was breached, based on events related to SLA breaches",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT FIRST(event_name) \n\t\t\tWHERE event_name IN (${sla_breach_events})) IS NOT NULL)",
      category: "SLAs",
      variables: [
        {
          name: "sla_breach_events",
          description:
            "Events indicating the breach of an SLA, for example 'Incident Resolution SLA Breached'",
          defaultValue:
            "'Incident Resolution SLA Breached','Incident Response SLA Breached'",
          defaultValues: [
            "'Incident Resolution SLA Breached','Incident Response SLA Breached'",
          ],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "actual_to_target_sla_ratio",
      name: "Average actual to target SLA ratio",
      description:
        "Ratio between the average incident resolution duration to target SLA duration",
      signalFragment:
        "AVG(\n\t((SELECT LAST(end_time) WHERE event_name IN (${sla_closure_events}))\n\t-(SELECT FIRST(end_time) WHERE event_name IN (${sla_creation_events})))\n) / (DURATION ${target_sla_time})\n*100",
      category: "SLAs",
      variables: [
        {
          name: "sla_closure_events",
          description:
            "Events defining the closing events of a case, for example 'Close Incident'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
        {
          name: "sla_creation_events",
          description:
            "Events defining the start events of a case, for example 'Create Incident'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
        {
          name: "target_sla_time",
          description: "SLA time expectation, for example '15 days'",
          defaultValue: "'15days'",
          defaultValues: ["'15days'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_sla_meet_expectations",
      name: "Percentage of incident resolutions that meet SLA expectations",
      description: "Percentage of incident resolutions that met their target",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE (\n\tSELECT LAST(end_time) FILTER (WHERE event_name IN (${sla_closure_events}))\n\t-\n\tFIRST(end_time) FILTER (WHERE event_name IN (${sla_creation_events}))\n\t) < DURATION ${target_sla_time}\n)\n/count(case_id) *100",
      category: "SLAs",
      variables: [
        {
          name: "sla_closure_events",
          description:
            "Events defining the closing events of a case, for example 'Close Incident'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
        {
          name: "sla_creation_events",
          description:
            "Events defining the start events of a case, for example 'Create Incident'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
        {
          name: "target_sla_time",
          description: "SLA time expectation, for example '15 days'",
          defaultValue: "'15days'",
          defaultValues: ["'15days'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [],
      aggregationType: "CASE",
    },
  ];

  const metrics2 = [
    {
      id: "INCIDENT_TO_RESOLUTION_total_incident_number",
      name: "Total number of created incidents",
      description: "Total number of created incidents",
      signalFragment: "COUNT(case_id)",
      variables: [],
      sourceSystems: [],
      processTypes: [
        {
          id: "INCIDENT_TO_RESOLUTION",
          name: "Incident-to-Resolution",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_open_incident_number",
      name: "Total number of open incidents",
      description: "Total number of open incidents",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE \n\t(SELECT BOOL_AND(\n NOT event_name IN (${incident_closure_events})))\n)",
      variables: [
        {
          name: "incident_closure_events",
          description:
            "Events defining the closing events of a case, for example 'Close Incident'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [
        {
          id: "INCIDENT_TO_RESOLUTION",
          name: "Incident-to-Resolution",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_resolved_incident_number",
      name: "Total number of resolved incidents",
      description: "Total number of resolved incidents",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE \n\t(SELECT BOOL_OR(\n event_name IN (${incident_closure_events})))\n)",
      variables: [
        {
          name: "incident_closure_events",
          description:
            "Events defining the closing events of a case, for example 'Close Incident'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [
        {
          id: "INCIDENT_TO_RESOLUTION",
          name: "Incident-to-Resolution",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_avg_response_time",
      name: "Average response time",
      description: "Average time from incident creation to first response",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${response_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${incident_creation_events}))\n   )",
      variables: [
        {
          name: "response_events",
          description:
            "Events defining the response to a recently opened case, for example 'Assign ticket', 'Create ticket'",
          defaultValue: "'Assign Incident to User'",
          defaultValues: ["'Assign Incident to User'"],
        },
        {
          name: "incident_creation_events",
          description:
            "Events defining the start events of a case, for example 'Create Problem', 'Create Incident'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [
        {
          id: "INCIDENT_TO_RESOLUTION",
          name: "Incident-to-Resolution",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_avg_resolution_time",
      name: "Average resolution time",
      description: "Average time from incident creation to its resolution",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${resolution_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${incident_creation_events}))\n   )",
      variables: [
        {
          name: "resolution_events",
          description:
            "Events defining the resolution of a case, for example 'Close Incident', 'Mark Incident as Resolved'",
          defaultValue: "'Close Incident', 'Mark Incident as Resolved'",
          defaultValues: ["'Close Incident', 'Mark Incident as Resolved'"],
        },
        {
          name: "incident_creation_events",
          description:
            "Events defining the start events of a case, for example 'Create Problem', 'Create Incident'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [
        {
          id: "INCIDENT_TO_RESOLUTION",
          name: "Incident-to-Resolution",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_first_call_resolution_rate",
      name: "First call resolution rate",
      description:
        "Percentage of incidents that are resolved without any rework. Rework is defined here as any case that contains the same event name more than once.",
      signalFragment:
        "COUNT(case_id) FILTER(\n\tWHERE (SELECT COUNT(DISTINCT event_name)) = (SELECT COUNT(event_name))\n\t)",
      variables: [],
      sourceSystems: [],
      processTypes: [
        {
          id: "INCIDENT_TO_RESOLUTION",
          name: "Incident-to-Resolution",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_itr_sla_breach_ratio",
      name: "SLA breach ratio",
      description: "Percentage of cases that have breached the SLAs",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE \n\t (SELECT BOOL_OR(\n event_name IN (${itr_sla_breach_events})))\n)/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "itr_sla_breach_events",
          description:
            "Events that mark the time when the SLA was breached, for example 'Incident Resolution SLA Breached'",
          defaultValue:
            "'Incident Response SLA Breached','Incident Resolution SLA Breached'",
          defaultValues: [
            "'Incident Response SLA Breached','Incident Resolution SLA Breached'",
          ],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [
        {
          id: "INCIDENT_TO_RESOLUTION",
          name: "Incident-to-Resolution",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_avg_ticket_reassignment_rate",
      name: "Average ticket reassignment rate",
      description: "Average number of reassignments per case",
      signalFragment: "(SUM(${incident_reassignments})\n/ COUNT(case_id))",
      variables: [
        {
          name: "incident_reassignments",
          description:
            'Attribute referring to the reassignment count for incidents, for example, in ServiceNow it is called "IncidentReassignmentCount"',
          defaultValue: '"IncidentReassignmentCount"',
          defaultValues: ['"IncidentReassignmentCount"'],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [
        {
          id: "INCIDENT_TO_RESOLUTION",
          name: "Incident-to-Resolution",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_avg_rework_rate",
      name: "Average rework rate",
      description: "Percentage of cases with rework",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (${rework_condition}))\n/ COUNT(case_id))\n* 100",
      variables: [
        {
          name: "rework_condition",
          description:
            'Condition defining a rework event, for example "COUNT(event_name) > COUNT(DISTINCT event_name)" and "IncidentReassignmentCount >= 1"',
          defaultValue: '"IncidentReassignmentCount" >= 1',
          defaultValues: ['"IncidentReassignmentCount" >= 1'],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [
        {
          id: "INCIDENT_TO_RESOLUTION",
          name: "Incident-to-Resolution",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INCIDENT_TO_RESOLUTION_high_priority_incident_ratio",
      name: "High priority incident ratio",
      description: "Percentage of cases with high priority",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (${high_priority})) \n/ COUNT(case_id))\n* 100",
      variables: [
        {
          name: "high_priority",
          description:
            'Condition defining cases with high priority, for example "IncidentPriority = 1" or "IncidentCategory = \'Urgent\'"',
          defaultValue:
            '"IncidentPriority" = 1 OR "IncidentCategory" = \'Urgent\'',
          defaultValues: [
            '"IncidentPriority" = 1 OR "IncidentCategory" = \'Urgent\'',
          ],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [
        {
          id: "INCIDENT_TO_RESOLUTION",
          name: "Incident-to-Resolution",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_opp_expected_revenue_amount",
      name: "Total amount of opportunity expected revenue",
      description:
        "Total amount of the expected revenue considering all opportunities",
      signalFragment: "SUM(${cx_opportunity_expected_revenue})\n",
      variables: [
        {
          name: "cx_opportunity_expected_revenue",
          description:
            'Attribute that identifies a the expected revenue of the opportunity, for example "Opportunity Expected Revenue Amount"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_opp_lost_expected_revenue_amount",
      name: "Total amount of opportunity expected revenue lost",
      description:
        "Total amount of the expected revenue considering only opportunity lost",
      signalFragment:
        "SUM(${cx_opportunity_expected_revenue}) FILTER (\n\tWHERE ${cx_opp_lost_condition})\n",
      variables: [
        {
          name: "cx_opportunity_expected_revenue",
          description:
            'Attribute that identifies a the expected revenue of the opportunity, for example "Opportunity Expected Revenue Amount"',
          defaultValues: [],
        },
        {
          name: "cx_opp_lost_condition",
          description:
            "Condition indicating that an opportunity is lost, for example \"Opportunity Status\" = 'Lost'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_opp_won_expected_revenue_amount",
      name: "Total amount of opportunity expected revenue won",
      description:
        "Total amount of the expected revenue considering only opportunity won",
      signalFragment:
        "SUM(${cx_opportunity_expected_revenue}) FILTER (\n\tWHERE ${cx_opp_won_condition})\n",
      variables: [
        {
          name: "cx_opportunity_expected_revenue",
          description:
            'Attribute that identifies a the expected revenue of the opportunity, for example "Opportunity Expected Revenue Amount"',
          defaultValues: [],
        },
        {
          name: "cx_opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"Opportunity Status\" = 'Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_lead_conversion_rate",
      name: "Lead Conversion Rate",
      description:
        "Percentage of converted lead: ((number of leads converted to opportunities) / (number of leads processed)) X 100",
      signalFragment:
        "COUNT(case_id)\nFILTER(WHERE event_name MATCHES (${cx_lead_converted_events}))/count(case_id) * 100",
      variables: [
        {
          name: "cx_lead_converted_events",
          description:
            "Events that indicating that a lead was converted, for example 'Lead: Converted'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_opp_lost_time",
      name: "Average opportunity lost time",
      description:
        "Average time from creating the opportunity to loosing the opportunity",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) \n\tWHERE event_name IN (${cx_opp_lost_events})) \n\t-\n\t(SELECT FIRST(end_time) \n\tWHERE event_name IN (${cx_opp_created_events}))\n)",
      variables: [
        {
          name: "cx_opp_lost_events",
          description:
            "Events indicating that a opportunity was lost, for example 'Opportunity: Lost'",
          defaultValues: [],
        },
        {
          name: "cx_opp_created_events",
          description:
            "Events indicating that a opportunity was created, for example 'Opportunity: Identify opportunity'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_lead_response_time",
      name: "Average lead response time",
      description: "Average time from lead creation to working on lead",
      signalFragment:
        "AVG(\n\t(SELECT FIRST(end_time) FILTER (\n\t\tWHERE NOT event_name IN (${cx_lead_created_events})))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE event_name IN (${cx_lead_created_events})))\n   )",
      variables: [
        {
          name: "cx_lead_created_events",
          description:
            "Events indicating that a lead was created, for example 'Lead: Open'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_won_opp",
      name: "Total number of won opportunities",
      description: "Total number of won opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${cx_opp_won_condition})\n\t)",
      variables: [
        {
          name: "cx_opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"Opportunity Status\" = 'Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_opp_wo_lead",
      name: "Opportunities without lead",
      description: "Total number of opportunities without lead",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${cx_lead_identifier} IS NULL\n\t)",
      variables: [
        {
          name: "cx_lead_identifier",
          description:
            'Attribute that identifies a lead, for example "Is Lead"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_open_opp",
      name: "Total number of open opportunities",
      description: "Total number of currently open opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_AND( NOT event_name IN (${cx_close_opp_events})))\n\t)",
      variables: [
        {
          name: "cx_close_opp_events",
          description:
            "Events indicating that an opportunity was closed, for example 'Opportunity: Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_lead_converted_w_qualification",
      name: "Leads Converted with Qualification",
      description: "Number of leads converted with qualification",
      signalFragment:
        "count(case_id)\nfilter(WHERE event_name MATCHES(${cx_lead_convert_qualified_events}))",
      variables: [
        {
          name: "cx_lead_convert_qualified_events",
          description:
            "Condition that indicating that a case was converted after being qualified, for example 'Lead: Qualified' ~> 'Lead: Converted'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_closed_opp",
      name: "Total number of closed opportunities",
      description: "Total number of currently closed opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${cx_close_opp_events})))\n\t)",
      variables: [
        {
          name: "cx_close_opp_events",
          description:
            "Events indicating that an opportunity was closed, for example 'Opportunity: Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_win_loss_ratio",
      name: "Win/loss ratio",
      description:
        "Ratio of won to lost opportunities. A value > 1 indicates that there are more opportunities won than lost.",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (${cx_opp_won_condition}))\n)\n/\n(COUNT(case_id) FILTER (\n\tWHERE (${cx_opp_lost_condition}))\n)",
      variables: [
        {
          name: "cx_opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"Opportunity Status\" = 'Won'",
          defaultValues: [],
        },
        {
          name: "cx_opp_lost_condition",
          description:
            "Condition indicating that an opportunity is lost, for example \"Opportunity Status\" = 'Lost'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_lead_conversion_time",
      name: "Average lead conversion time ",
      description: "Average time from lead creation to lead conversion",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) \n\tWHERE event_name IN (${cx_lead_converted_events})) \n\t-\n\t(SELECT FIRST(end_time) \n\tWHERE event_name IN (${cx_lead_created_events}))\n)",
      variables: [
        {
          name: "cx_lead_converted_events",
          description:
            "Events that indicating that a lead was converted, for example 'Lead: Converted'",
          defaultValues: [],
        },
        {
          name: "cx_lead_created_events",
          description:
            "Events indicating that a lead was created, for example 'Lead: Open'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_opp_won_time",
      name: "Average opportunity win time",
      description:
        "Average time from creating the opportunity to winning the opportunity",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) \n\tWHERE event_name IN (${cx_opp_won_events})) \n\t-\n\t(SELECT FIRST(end_time) \n\tWHERE event_name IN (${cx_opp_created_events}))\n)",
      variables: [
        {
          name: "cx_opp_won_events",
          description:
            "Events indicating that a opportunity was won, for example 'Opportunity: Won'",
          defaultValues: [],
        },
        {
          name: "cx_opp_created_events",
          description:
            "Events indicating that a opportunity was created, for example 'Opportunity: Identify opportunity'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_lead_converted_wo_qualification",
      name: "Leads Converted without Qualification",
      description: "Number of leads converted without qualification",
      signalFragment:
        "count(case_id)\nfilter(WHERE event_name MATCHES(${cx_lead_converted_events}))\n-\ncount(case_id)\nfilter(WHERE event_name MATCHES(${cx_lead_convert_qualified_events}))",
      variables: [
        {
          name: "cx_lead_converted_events",
          description:
            "Events that indicating that a lead was converted, for example 'Lead: Converted'",
          defaultValues: [],
        },
        {
          name: "cx_lead_convert_qualified_events",
          description:
            "Condition that indicating that a case was converted after being qualified, for example 'Lead: Qualified' ~> 'Lead: Converted'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_qualified_lead",
      name: "Total number of qualified leads",
      description: "Total number of qualified leads",
      signalFragment:
        "COUNT(CASE_ID) FILTER (\n\tWHERE EVENT_NAME MATCHES (${cx_lead_qualified_events}))\n",
      variables: [
        {
          name: "cx_lead_qualified_events",
          description:
            "Events that indicating that a lead was qualified, for example 'Lead: Qualified'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_lead_converted",
      name: "Total of leads converted",
      description: "Total of leads converted",
      signalFragment:
        "COUNT (CASE_ID) FILTER (WHERE EVENT_NAME MATCHES (${cx_lead_converted_events}))\n",
      variables: [
        {
          name: "cx_lead_converted_events",
          description:
            "Events that indicating that a lead was converted, for example 'Lead: Converted'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_no_touch_opp",
      name: "No-touch Opportunity",
      description: "Percentage of opportunities without interactions",
      signalFragment:
        'COUNT ("case_id") FILTER (\n\tWHERE ${cx_attr_number_tasks} = 0\n      AND ${cx_attr_number_appointments} = 0\n      AND ${cx_attr_number_emails} = 0\n      AND ${cx_attr_number_phone_calls} = 0\n      AND ${cx_attr_number_visits} = 0\n      )\n',
      variables: [
        {
          name: "cx_attr_number_tasks",
          description:
            'Attribute that identifies the number of tasks created for a specific opportunity , for example "Number of Tasks"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_appointments",
          description:
            'Attribute that identifies the number of appointments created for a specific opportunity , for example "Number of Appointments"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_emails",
          description:
            'Attribute that identifies the number of e-mail sent to a customer for a specific opportunity , for example "Number of E-mails"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_phone_calls",
          description:
            'Attribute that identifies the number of phone calls made to a customer for a specific opportunity , for example "Number of Phones"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_visits",
          description:
            'Attribute that identifies the number of visits made to a customer for a specific opportunity , for example "Number of Visits"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_win_ratio",
      name: "Win ratio",
      description:
        "Percentage of won to all the opportunities in the sales cloud system",
      signalFragment:
        "((COUNT(case_id) FILTER (\n\tWHERE (${cx_opp_won_condition}))\n)\n/\n(COUNT(case_id))*100\n)",
      variables: [
        {
          name: "cx_opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"Opportunity Status\" = 'Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_no_touch_opp_won",
      name: "No-touch Won Opportunity",
      description: "Total number of won opportunities without interactions",
      signalFragment:
        'COUNT ("case_id") FILTER (\n\tWHERE ${cx_opp_won_condition}\n      AND ${cx_attr_number_visits} = 0\n      )\n',
      variables: [
        {
          name: "cx_opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"Opportunity Status\" = 'Won'",
          defaultValues: [],
        },
        {
          name: "cx_attr_number_visits",
          description:
            'Attribute that identifies the number of visits made to a customer for a specific opportunity , for example "Number of Visits"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_opp_w_lead",
      name: "Opportunity with leads",
      description:
        "Number of opportunities created as a follow-up of the lead process",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${cx_lead_identifier} IS NOT NULL\n\t)",
      variables: [
        {
          name: "cx_lead_identifier",
          description:
            'Attribute that identifies a lead, for example "Is Lead"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_touchpoint_per_opp",
      name: "Average number of touchpoints per opportunity",
      description:
        "Average number of touchpoints, for example appointments, email, phone calls and task per opportunities ",
      signalFragment:
        "AVG(${cx_attr_number_tasks} +\n    ${cx_attr_number_appointments} +\n    ${cx_attr_number_emails} +\n    ${cx_attr_number_phone_calls} +\n    ${cx_attr_number_visits})\n",
      variables: [
        {
          name: "cx_attr_number_tasks",
          description:
            'Attribute that identifies the number of tasks created for a specific opportunity , for example "Number of Tasks"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_appointments",
          description:
            'Attribute that identifies the number of appointments created for a specific opportunity , for example "Number of Appointments"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_emails",
          description:
            'Attribute that identifies the number of e-mail sent to a customer for a specific opportunity , for example "Number of E-mails"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_phone_calls",
          description:
            'Attribute that identifies the number of phone calls made to a customer for a specific opportunity , for example "Number of Phones"',
          defaultValues: [],
        },
        {
          name: "cx_attr_number_visits",
          description:
            'Attribute that identifies the number of visits made to a customer for a specific opportunity , for example "Number of Visits"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_employee_change_opp",
      name: "Average number of employee changes per opportunity",
      description: "Average number of employee changes per opportunity",
      signalFragment: "AVG(${cx_attr_number_employee_changes}) \n",
      variables: [
        {
          name: "cx_attr_number_employee_changes",
          description:
            'Attribute that identifies the number of employee changes for a specific opportunity , for example "Number of Employees Change"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_total_nr_lead_declined",
      name: "Total of leads declined",
      description: "Total of leads declined or rejected",
      signalFragment:
        "COUNT (CASE_ID) FILTER (WHERE EVENT_NAME MATCHES (${cx_lead_declined_events}))",
      variables: [
        {
          name: "cx_lead_declined_events",
          description:
            "Events that indicating that a lead was declined or rejected, for example 'Lead: Declined'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD_avg_contacts_person_opp",
      name: "Average number of contact persons per opportunity ",
      description: "Average number of contact persons per opportunity ",
      signalFragment: "AVG(${cx_attr_number_contacted_people})",
      variables: [
        {
          name: "cx_attr_number_contacted_people",
          description:
            'Attribute that identifies the number of contacted people related a specific opportunity , for example "Number of Contacts"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_SALES_CLOUD"],
      processTypes: [
        {
          id: "LEAD_TO_OPPORTUNITY_SAP_SALES_CLOUD",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_conformance_level",
      name: "Conformance level",
      description: "Percentage of cases without conformance issues",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT event_name MATCHES ((${no_happy_path_events}))\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "no_happy_path_events",
          description:
            "Events that should not be part of the \"to be\" process. For example: 'Change Meter Reading Data'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_customer_self_readings",
      name: "Number of meter readings performed by customer",
      description:
        "Number of meter readings performed by customer (self-reading)",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\tSELECT BOOL_OR(event_name IN (${obtain_readings_events})\n\t\tAND ${self_reading_condition}))\n\t)",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "self_reading_condition",
          description:
            "Condition defining that the reading was performed by the customer. For example: \"MeterReadingTypeActual\" = 'Customer'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_onsite_readings",
      name: "Number of meter readings performed on-site",
      description: "Number of meter readings performed on-site by utility",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\tSELECT BOOL_OR(event_name IN (${obtain_readings_events})\n\t\tAND ${utility_reading_condition}))\n\t)",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "utility_reading_condition",
          description:
            "Condition defining that the reading was performed by utility. For example: \"MeterReadingTypeActual\" = 'Utility'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_readings_after_invoicing",
      name: "Number of meter reading data obtained after invoicing",
      description:
        "Number of meter reading data obtained after invoicing period",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${obtain_readings_events})))\n\t\tAND ${after_invoicing_condition}\n\t)\n)",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "after_invoicing_condition",
          description:
            'Condition defining that a given event happens after invoicing. For example: LAST(end_time)) > "LastInvoiceBillingKeyDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_non_reachable_smart_meters",
      name: "Number of non-reachable smart meters",
      description:
        "Number of smart meter devices for which no data was transmitted for 10+ days",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE (\n\tSELECT LAST(end_time) FILTER (WHERE event_name IN (${obtain_readings_events}))\n\t-\n\tFIRST(end_time) FILTER (WHERE event_name IN (${create_reading_orders_events}))\n\t) > DURATION ${non_reachable_smart_meters_period}\n)",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "create_reading_orders_events",
          description:
            "Events identifying when meter reading orders are created. For example: 'Create Meter Reading Order'",
          defaultValues: [],
        },
        {
          name: "non_reachable_smart_meters_period",
          description:
            "Reference time period over which a smart meter is considered non-reachable. For example: '10days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_missing_meter_readings",
      name: "Number of missing meter readings",
      description:
        "Number of meter readings for which the scheduled reading date is passed, but no data was obtained",
      signalFragment:
        "COUNT (case_id) FILTER (\n\t\tWHERE ${overdue_reading_date_condition}\n\t\tAND (SELECT BOOL_AND(NOT event_name IN (${obtain_readings_events})))\n\t)",
      variables: [
        {
          name: "overdue_reading_date_condition",
          description:
            'Condition defining that the scheduled reading date passed. For example: "MeterReadingScheduledReadingDate" < NOW()',
          defaultValues: [],
        },
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_ratio_timely_late_readings",
      name: "Ratio between timely and late meter readings",
      description: "Ratio between timely and late meter readings",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${obtain_readings_events})))\n\t\tAND ${timely_meter_reading_condition})\n\t)\n/\nCOUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${obtain_readings_events})))\n\t\tAND ${late_meter_reading_condition})\n\t)\n)*100",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "timely_meter_reading_condition",
          description:
            'Condition defining that the meter reading was done timely compared to the reference event timestamp. For example: LAST(end_time)) <= "MeterReadingScheduledReadingDate"',
          defaultValues: [],
        },
        {
          name: "late_meter_reading_condition",
          description:
            'Condition defining that the meter reading was done late compared to the reference event timestamp. For example: LAST(end_time)) > "MeterReadingScheduledReadingDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_timely_readings_percent",
      name: "Percentage of timely meter readings",
      description: "Percentage of total meter readings completed on-time",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${obtain_readings_events})))\n\t\tAND ${timely_meter_reading_condition})\n\t)\n/\nCOUNT(case_id) *100",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "timely_meter_reading_condition",
          description:
            'Condition defining that the meter reading was done timely compared to the reference event timestamp. For example: LAST(end_time)) <= "MeterReadingScheduledReadingDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_late_readings_percent",
      name: "Percentage of late meter readings",
      description: "Percentage of total meter readings completed late",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${obtain_readings_events})))\n\t\tAND ${late_meter_reading_condition})\n\t)\n/\nCOUNT(case_id) *100",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "late_meter_reading_condition",
          description:
            'Condition defining that the meter reading was done late compared to the reference event timestamp. For example: LAST(end_time)) > "MeterReadingScheduledReadingDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_manual_changes_meter_readings",
      name: "Number of manual changes to meter readings",
      description:
        "Number of manual changes on the obtained meter reading data",
      signalFragment:
        "COUNT(case_id) FILTER (\n\t\tWHERE (SELECT BOOL_OR(event_name IN (${change_readings_events}))\n\t\tAND BOOL_OR(${mtc_manual_changes_condition}))\n\t\t)",
      variables: [
        {
          name: "change_readings_events",
          description:
            "Events identifying when meter readings are changed. For example: 'Change Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "mtc_manual_changes_condition",
          description:
            "Attributes indicating that an event was executed manually. For example: \"EventCreatedByUserType\" = 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_meter_readings_invoice_cancellation",
      name: "Percentage of meter readings with cancellations of invoice or billing",
      description:
        "Percentage of meter readings with cancellations of invoice or billing",
      signalFragment:
        "COUNT(case_id) FILTER (\n\t\tWHERE (SELECT BOOL_OR(event_name IN (${invoice_billing_cancellation_events})))\n\t\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "invoice_billing_cancellation_events",
          description:
            "Events identifying when invoice or billing documents are cancelled. For example: 'Cancel Billing Document','Cancel Invoice Document'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_nr_meter_orders_dunning",
      name: "Number of meter reading orders that resulted in a dunning notice",
      description:
        "Number of meter reading orders that resulted in a dunning notice",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${order_dunning_condition})\n\t)",
      variables: [
        {
          name: "order_dunning_condition",
          description:
            "Condition defining that the meter reading order resulted in a dunning notice. For example: 'Create Meter Reading Order' ~> 'Create Dunning Notice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_percentage_meter_orders_dunning",
      name: "Percentage of meter reading orders that resulted in a dunning notice",
      description:
        "Percentage of meter reading orders that resulted in a dunning notice",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${order_dunning_condition})\n\t)\n/ COUNT(case_id)*100",
      variables: [
        {
          name: "order_dunning_condition",
          description:
            "Condition defining that the meter reading order resulted in a dunning notice. For example: 'Create Meter Reading Order' ~> 'Create Dunning Notice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_nr_meter_orders_paid_after_dunning",
      name: "Number of meter reading orders that were paid after dunning notice",
      description:
        "Number of meter reading orders that were paid after dunning notice",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${order_paid_after_dunning_condition})\n\t)",
      variables: [
        {
          name: "order_paid_after_dunning_condition",
          description:
            "Condition defining that the meter reading order resulted in a dunning notice and afterwards it was paid. For example: 'Create Meter Reading Order' ~> 'Create Dunning Notice' ~> 'Receive Incoming Payment'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_percentage_meter_orders_paid_after_dunning",
      name: "Percentage of meter reading orders that were paid after dunning notice",
      description:
        "Percentage of meter reading orders that were paid after dunning notice",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${order_paid_after_dunning_condition})\n\t)\n/ COUNT(case_id)*100",
      variables: [
        {
          name: "order_paid_after_dunning_condition",
          description:
            "Condition defining that the meter reading order resulted in a dunning notice and afterwards it was paid. For example: 'Create Meter Reading Order' ~> 'Create Dunning Notice' ~> 'Receive Incoming Payment'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_avg_time_create_order_obtain_data",
      name: "Average time from 'Create Meter Reading Order' to 'Obtain Meter Reading Data'",
      description:
        "Average time from meter reading order creation to meter reading data obtained",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${obtain_readings_events}))\n\t-(SELECT FIRST(end_time)\n\tWHERE event_name IN (${create_reading_orders_events}))\n\t)",
      variables: [
        {
          name: "obtain_readings_events",
          description:
            "Events identifying when meter readings data have been obtained. For example: 'Obtain Meter Reading Data'",
          defaultValues: [],
        },
        {
          name: "create_reading_orders_events",
          description:
            "Events identifying when meter reading orders are created. For example: 'Create Meter Reading Order'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_value_open_invoices",
      name: "Value of open invoices",
      description: "Value of currently open invoices which were not yet paid",
      signalFragment:
        'SUM("LastInvoiceAmount")\n-\n(SUM("LastInvoiceAmount") FILTER (\n\t\tWHERE (SELECT BOOL_OR(event_name IN (${receive_payment_events})\n\t\tAND NOT event_name IN (${invoice_billing_cancellation_events})))\n\t))',
      variables: [
        {
          name: "receive_payment_events",
          description:
            "Events identifying when an invoice has been cleared. For example: 'Receive Incoming Payment'",
          defaultValues: [],
        },
        {
          name: "invoice_billing_cancellation_events",
          description:
            "Events identifying when invoice or billing documents are cancelled. For example: 'Cancel Billing Document','Cancel Invoice Document'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "METER_TO_CASH_volume_overdue_invoices",
      name: "Volume of overdue invoices",
      description:
        "Volume of currently open invoices which were not yet paid and are overdue",
      signalFragment:
        "COUNT(case_id) FILTER (\n\t\tWHERE ${overdue_invoice_condition}\n\t\tAND (SELECT BOOL_AND(NOT event_name IN (${receive_payment_events}, ${invoice_billing_cancellation_events})))\n\t)",
      variables: [
        {
          name: "overdue_invoice_condition",
          description:
            'Condition defining that the invoice due date passed. For example: "LastInvoicePaymentDueDate" < NOW()',
          defaultValues: [],
        },
        {
          name: "receive_payment_events",
          description:
            "Events identifying when an invoice has been cleared. For example: 'Receive Incoming Payment'",
          defaultValues: [],
        },
        {
          name: "invoice_billing_cancellation_events",
          description:
            "Events identifying when invoice or billing documents are cancelled. For example: 'Cancel Billing Document','Cancel Invoice Document'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ISU"],
      processTypes: [
        {
          id: "METER_TO_CASH",
          name: "Meter-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_total_overdue_invoice_amount",
      name: "Total overdue invoice amounts",
      description:
        "Sum of all invoice amounts that are overdue (converted in USD)",
      signalFragment:
        "SUM(${itc_amount_conv}) FILTER(\n\t WHERE (${itc_clearing_date} IS NULL)\n\t\tAND ${itc_due_date} < DATE_TRUNC('day', NOW())\n\t)",
      variables: [
        {
          name: "itc_amount_conv",
          description:
            'Attribute identifying the amount (converted to USD) of an invoice, for example "Inv. Converted USD Amount"',
          defaultValues: [],
        },
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_open_overdue_invoices",
      name: "Number of open overdue invoices",
      description: "Number of invoices that are currently open and overdue",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} IS NULL)\n\t\tAND ${itc_due_date} < DATE_TRUNC('day', NOW())\n)",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_lead_time",
      name: "Average time invoice creation to invoice clearing",
      description:
        "Average time from invoice creation to invoice clearing within a reference period",
      signalFragment:
        "AVG(\n\t(SELECT LAST(${itc_clearing_date}) \n\t\tWHERE ((NOW() - LAST(end_time)) < DURATION ${itc_invoice_clearing_period}))\n\t-(SELECT LAST(${itc_posting_date})\n\t\tWHERE ((NOW() - LAST(end_time)) < DURATION ${itc_invoice_posting_period}))\n\t)",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_invoice_clearing_period",
          description:
            "Reference time period to monitor invoice creation to clearing times within, for example the last 60 weeks: '60weeks'",
          defaultValues: [],
        },
        {
          name: "itc_posting_date",
          description:
            'Attribute identifying the posting date of an invoice, for example "Inv. Posting Document Date"',
          defaultValues: [],
        },
        {
          name: "itc_invoice_posting_period",
          description:
            "Reference time period to monitor clearing of invoices within, for example the last 60 weeks: '60weeks'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_avg_creation_pgi_invoice",
      name: "Average time post goods issue to invoice creation",
      description: "Average time from posting goods issue to invoice creation",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) \n\tWHERE event_name IN (${itc_invoice_creation_events})) \n\t-\n\t(SELECT FIRST(end_time) \n\tWHERE event_name IN (${itc_shipping_events}))\n)",
      variables: [
        {
          name: "itc_invoice_creation_events",
          description:
            "Events identifying the creation of invoice items, for example 'Create Invoice'",
          defaultValues: [],
        },
        {
          name: "itc_shipping_events",
          description:
            "Events identifying that the goods have been shipped, for example 'Record Goods Issue'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_no_payment_rate",
      name: "No payment rate",
      description: "Percentage of overdue invoices from all open invoices",
      signalFragment:
        "COUNT (case_id) FILTER (\n\tWHERE (${itc_clearing_date} IS NULL AND ${itc_due_date} < DATE_TRUNC('day', NOW()))\n\t)\n/ COUNT (case_id) FILTER(\n\tWHERE (${itc_clearing_date} IS NULL)) * 100",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_dunning_rate",
      name: "Dunning rate",
      description: "Percentage of invoices that were dunned",
      signalFragment:
        "COUNT (case_id) FILTER (\n\tWHERE (${itc_dunning_condition})\n\t) / COUNT (case_id) * 100",
      variables: [
        {
          name: "itc_dunning_condition",
          description:
            'Condition defining that an invoice has already been dunned, for example "InvoiceLastDunnedOn" IS NOT NULL',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_automation_rate_inv_clearing",
      name: "Automation rate for invoice clearing",
      description: "Percentage of automated invoice clearing events",
      signalFragment:
        "SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE (event_name IN (${itc_clear_invoice_events})\n\t\t\tAND (${itc_automation_condition})))\n\t)\n)\n/ SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\tWHERE (event_name IN (${itc_clear_invoice_events})))\n\t)\n)\n* 100",
      variables: [
        {
          name: "itc_clear_invoice_events",
          description:
            "Event identifying the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "itc_automation_condition",
          description:
            "Condition indicating that an event was automated, for example \"Event Created By User Type\" <> 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_duration_of_dunning_blocks",
      name: "Duration of dunning blocks",
      description:
        "Average lead time from setting a dunning block to removing the last dunning block",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER \n\t\t(WHERE event_name IN (${itc_remove_dunning_block_events})))\n\t-\n\t(SELECT FIRST(end_time) FILTER\n\t\t(WHERE event_name IN (${itc_set_dunning_block_events})))\n)",
      variables: [
        {
          name: "itc_remove_dunning_block_events",
          description:
            "Event identifying the removal of a dunning block for an invoice, for example 'Remove Dunning Block'",
          defaultValues: [],
        },
        {
          name: "itc_set_dunning_block_events",
          description:
            "Event identifying the setting of a dunning block for an invoice, for example 'Set Dunning Block'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_days_sales_outstanding",
      name: "Days Sales Outstanding (DSO)",
      description:
        "Average number of days to collect revenue, weighted by the invoice value",
      signalFragment:
        "AVG((\n\t(SELECT LAST(${itc_clearing_date})) \n\t\t- (SELECT FIRST(${itc_posting_date})))\n\t*(SELECT LAST(${itc_amount_conv}))\n)",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_posting_date",
          description:
            'Attribute identifying the posting date of an invoice, for example "Inv. Posting Document Date"',
          defaultValues: [],
        },
        {
          name: "itc_amount_conv",
          description:
            'Attribute identifying the amount (converted to USD) of an invoice, for example "Inv. Converted USD Amount"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_late_payment_rate",
      name: "Late payment rate",
      description:
        "Percentage of invoices that were cleared 1 day after their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} - ${itc_due_date} \n\t\t> DURATION ${itc_late_payment_condition})\n)\n/COUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} IS NOT NULL)\n) * 100",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itc_late_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too late",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_early_payment_rate",
      name: "Early payment rate",
      description:
        "Percentage of invoices that were cleared more than 5 days before their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itc_due_date} - ${itc_clearing_date} \n\t\t> DURATION ${itc_early_payment_condition})\n)\n/COUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} IS NOT NULL)\n)* 100",
      variables: [
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_early_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too early",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_on_time_payment_rate",
      name: "On-time payment rate",
      description:
        "Percentage of invoices that were cleared less than 5 days before and no later than 1 day after their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} - ${itc_due_date} \n\t\t< DURATION ${itc_late_payment_condition}\n\tAND ${itc_due_date} - ${itc_clearing_date}\n\t\t< DURATION ${itc_early_payment_condition}\n\t)\n)\n/\nCOUNT(case_id) FILTER (\n\tWHERE (${itc_clearing_date} IS NOT NULL)\n)\n* 100",
      variables: [
        {
          name: "itc_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itc_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itc_late_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too late",
          defaultValues: [],
        },
        {
          name: "itc_early_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too early",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_no_touch_invoice",
      name: "No-Touch invoice processing rate",
      description: "Percentage of invoices with no change events",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT (event_name MATCHES(${itc_no_touch_condition})) \n\t\tAND (event_name MATCHES(${itc_clear_invoice_events}))\n)\n/ (COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itc_clear_invoice_events}))\n\t)\n* 100",
      variables: [
        {
          name: "itc_no_touch_condition",
          description:
            "Events that need manual intervention on an invoice and contradict the no-touch rate",
          defaultValues: [],
        },
        {
          name: "itc_clear_invoice_events",
          description:
            "Event identifying the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_inv_without_billing_doc",
      name: "Invoices without billing doc from SO",
      description: "Invoices without Billing Document from Sales Order",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(NOT ${itc_billing_doc_to_invoice_events})\n)",
      variables: [
        {
          name: "itc_billing_doc_to_invoice_events",
          description: "Billing Document to Invoice event flow",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_reversed_invoices",
      name: "Percentage of reversed invoices",
      description: "Percentage of invoices that were reversed",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itc_invoice_reversal_events}))\n/\nCOUNT(case_id)\n* 100",
      variables: [
        {
          name: "itc_invoice_reversal_events",
          description:
            "Event identifying the reversal of an invoice, for example 'Reverse Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_CASH_baseline_date_changes",
      name: "Percentage of baseline date changes",
      description:
        "Percentage of Baseline Date Changes after the Invoice was posted to SAP",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itc_change_baseline_date})\n\t\tAND event_name MATCHES(${itc_posting_to_baseline_update_events}))\n/\nCOUNT(case_id)\n* 100",
      variables: [
        {
          name: "itc_change_baseline_date",
          description:
            "Events that describe a change in baseline date, for example 'Update Baseline Date'",
          defaultValues: [],
        },
        {
          name: "itc_posting_to_baseline_update_events",
          description: "Invoice Posting to Baseline date changes event flow",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_CASH",
          name: "Invoice-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_total_overdue_invoice_amount",
      name: "Total overdue invoice amounts",
      description:
        "Sum of all invoice amounts that are open and overdue (converted to USD)",
      signalFragment:
        "SUM(${itp_amount_conv}) FILTER(\n\t WHERE (${itp_clearing_date} IS NULL)\n\t\tAND ${itp_due_date} < DATE_TRUNC('day', NOW()))",
      variables: [
        {
          name: "itp_amount_conv",
          description:
            'Attribute identifying the amount (converted to USD) of an invoice, for example "Inv. Converted USD Amount"',
          defaultValues: [],
        },
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_open_overdue_invoices",
      name: "Number of open overdue invoices",
      description: "Number of invoices that are currently open and overdue",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date} IS NULL)\n\t\tAND ${itp_due_date} < DATE_TRUNC('day', NOW()))",
      variables: [
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_overdue_ratio",
      name: "Ratio of overdue invoices",
      description: "Percentage of overdue invoices from all open invoices",
      signalFragment:
        "COUNT (case_id) FILTER (\n\tWHERE (${itp_clearing_date} IS NULL AND ${itp_due_date} < DATE_TRUNC('day', NOW()))\n\t)\n/ COUNT (case_id) FILTER(\n\tWHERE (${itp_clearing_date} IS NULL)) * 100",
      variables: [
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_dpo",
      name: "Days Payables Outstanding",
      description:
        "Days Payables Outstanding - Average time from invoice posting to invoice clearing within a reference period",
      signalFragment:
        "AVG(\n\t(SELECT LAST(${itp_clearing_date}) \n\t\tWHERE ((NOW() - LAST(end_time)) < DURATION ${itp_invoice_clearing_period}))\n\t-(SELECT LAST(${itp_posting_date})\n\t\tWHERE ((NOW() - LAST(end_time)) < DURATION ${itp_invoice_posting_period})))",
      variables: [
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_invoice_clearing_period",
          description:
            "Reference time period to monitor invoice creation to clearing times within, for example the last year: '52weeks'",
          defaultValues: [],
        },
        {
          name: "itp_posting_date",
          description:
            'Attribute identifying the posting date of an invoice, for example "Inv. Posting Document Date"',
          defaultValues: [],
        },
        {
          name: "itp_invoice_posting_period",
          description:
            "Reference time period to monitor clearing of invoices within, for example the last year: '52weeks'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_automation_rate_inv_clearing",
      name: "Automation rate for invoice clearing",
      description:
        "Percentage of automated invoice clearing events. For example 'Clear Invoice' events that are not performed by a Dialog user",
      signalFragment:
        "SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE (event_name IN (${itp_clear_invoice_events})\n\t\t\tAND (${itp_automation_condition})))\n\t)\n)\n/ SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\tWHERE (event_name IN (${itp_clear_invoice_events})))\n\t)\n)\n* 100",
      variables: [
        {
          name: "itp_clear_invoice_events",
          description:
            "Event identifying the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "itp_automation_condition",
          description:
            "Condition indicating that an event was automated, for example \"Event Created By User Type\" <> 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_late_payment_rate",
      name: "Late payment rate",
      description:
        "Percentage of invoices that were cleared more than 1 day after their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date} - ${itp_due_date} \n\t\t> DURATION ${itp_late_payment_condition})\n)\n/COUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date} IS NOT NULL)\n) * 100",
      variables: [
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itp_late_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too late, for example '1days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_early_payment_rate",
      name: "Early payment rate",
      description:
        "Percentage of invoices that were cleared more than 5 days before their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_due_date} - ${itp_clearing_date} \n\t\t> DURATION ${itp_early_payment_condition})\n)\n/COUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date} IS NOT NULL)\n)* 100",
      variables: [
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_early_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too early, for example '5days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_on_time_payment_rate",
      name: "On-time payment rate",
      description:
        "Percentage of invoices that were cleared less than 5 days before and no later than 1 day after their due dates",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date} - ${itp_due_date} \n\t\t< DURATION ${itp_late_payment_condition}\n\tAND ${itp_due_date} - ${itp_clearing_date}\n\t\t< DURATION ${itp_early_payment_condition}\n\t)\n)\n/\nCOUNT(case_id) FILTER (\n\tWHERE (${itp_clearing_date}IS NOT NULL)\n)\n* 100",
      variables: [
        {
          name: "itp_clearing_date",
          description:
            'Attribute identifying the clearing date of an invoice, for example "Last Inv. Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "itp_due_date",
          description:
            'Attribute identifying the due date of an invoice, for example "Last Inv. Item Due Date"',
          defaultValues: [],
        },
        {
          name: "itp_late_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too late, for example '1days'",
          defaultValues: [],
        },
        {
          name: "itp_early_payment_condition",
          description:
            "Number of days an invoice clearing is considered to be too early, for example '5days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_reversed_invoices",
      name: "Percentage of reversed invoices",
      description:
        "Percentage of invoices that were reversed counted for example by the number of 'Reverse Invoice' events",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itp_invoice_reversal_events}))\n/\nCOUNT(case_id)\n* 100",
      variables: [
        {
          name: "itp_invoice_reversal_events",
          description:
            "Event identifying the reversal of an invoice, for example 'Reverse Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_avg_gr_creation_posting_invoice",
      name: "Average time of goods receipt to invoice posting",
      description: "Average time from receipt of goods to invoice posting",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) \n\tWHERE event_name IN (${itp_invoice_posting_events})) \n\t-\n\t(SELECT FIRST(end_time) \n\tWHERE event_name IN (${itp_goods_receipt_events})))",
      variables: [
        {
          name: "itp_invoice_posting_events",
          description:
            "Events identifying the posting of invoice items, for example 'Post Invoice'",
          defaultValues: [],
        },
        {
          name: "itp_goods_receipt_events",
          description:
            "Events identifying that the goods have been shipped, for example 'Record Goods Issue'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_dunning_rate",
      name: "Dunning rate",
      description: "Percentage of invoices that were dunned",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_dunning_condition})\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "itp_dunning_condition",
          description:
            'Condition defining that an invoice has been dunned, for example "Last Inv. Item Dunned On" IS NOT NULL',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_duration_of_payment_blocks",
      name: "Duration of payment blocks",
      description:
        "Average lead time from setting a payment block to removing the last one",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER \n\t\t(WHERE event_name IN (${itp_remove_payment_block_events})))\n\t-\n\t(SELECT FIRST(end_time) FILTER\n\t\t(WHERE event_name IN (${itp_set_payment_block_events}))))",
      variables: [
        {
          name: "itp_remove_payment_block_events",
          description:
            "Event identifying the removal of a payment block for an invoice, for example 'Remove Payment Block'",
          defaultValues: [],
        },
        {
          name: "itp_set_payment_block_events",
          description:
            "Event identifying the setting of a payment block for an invoice, for example 'Set Payment Block'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_no_touch_invoice",
      name: "No-Touch invoice processing rate",
      description:
        "Percentage of cleared invoices where no change events occured",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT (event_name MATCHES(${itp_no_touch_condition})) \n\t\tAND (event_name MATCHES(${itp_clear_invoice_events}))\n)\n/ (COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itp_clear_invoice_events}))\n\t)\n* 100",
      variables: [
        {
          name: "itp_no_touch_condition",
          description:
            "Events that need manual intervention on an invoice and contradict the no-touch rate, for example 'Reverse Invoice'",
          defaultValues: [],
        },
        {
          name: "itp_clear_invoice_events",
          description:
            "Event identifying the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_invoices_without_purchase_order",
      name: "Invoices without po",
      description: "Invoices without purchase order",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(NOT ${itp_po_creation_to_invoice_posting})\n)",
      variables: [
        {
          name: "itp_po_creation_to_invoice_posting",
          description:
            "Purchase order creation followed directly or indirectly by invoice posting, for example 'Create Purchase Order'~> 'Post Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_baseline_date_changes",
      name: "Percentage of baseline date changes",
      description:
        "Percentage of Baseline Date Changes after the Invoice was posted",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itp_change_baseline_date})\n\t\tAND event_name MATCHES(${itp_posting_to_baseline_update_events}))\n/\nCOUNT(case_id)\n* 100",
      variables: [
        {
          name: "itp_change_baseline_date",
          description:
            "Events that describe a change in baseline date, for example 'Change Baseline Date'",
          defaultValues: [],
        },
        {
          name: "itp_posting_to_baseline_update_events",
          description:
            "Invoice Posting to Baseline date changes event flow, for example 'Post Invoice'~>'Change Baseline Date'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_missed_cash_discounts",
      name: "Missed cash discounts",
      description: "Amount of cash discounts missed due to late payments",
      signalFragment:
        "SUM(\n\t(${itp_amount_conv} * ${itp_discount_percentage})\n\t-${itp_discount_applied_to_invoice}\n\t)\nFILTER(\n\tWHERE EVENT_NAME MATCHES (${itp_cd_1_missed})\n\t\tOR EVENT_NAME MATCHES (${itp_cd_2_missed})\n\t)",
      variables: [
        {
          name: "itp_amount_conv",
          description:
            'Attribute identifying the amount (converted to USD) of an invoice, for example "Inv. Converted USD Amount"',
          defaultValues: [],
        },
        {
          name: "itp_discount_percentage",
          description:
            'Attribute referring to the maximum percentage discount that can be applied to the total amount of an invoice item, for example "Last Inv. Item Cash Discount Percentage1"',
          defaultValues: [],
        },
        {
          name: "itp_discount_applied_to_invoice",
          description:
            'Attribute referring to the actual cash discount applied when the invoice was paid, for example "Inv. Converted USD Cash Discount Amount"',
          defaultValues: [],
        },
        {
          name: "itp_cd_1_missed",
          description:
            "Order of events identifying that an invoice was paid after the cash discount due date 1, for example 'Cash Discount 1 Due Date passed'~>'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "itp_cd_2_missed",
          description:
            "Order of events identifying that an invoice was paid after the cash discount due date 2, for example 'Cash Discount 2 Due Date passed'~>'Clear Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_two_way_match_rate",
      name: "Two-way match rate",
      description:
        "Percentage of cases where the invoice amount equals the purchase order net order value",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_two_way_match_condition})\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "itp_two_way_match_condition",
          description:
            'Condition identifying invoices with a two-way attribute match, for example "PO Item Total Net Order Value" = "Inv. Amount in Document Currency"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_invoices_without_gr",
      name: "Invoices without goods receipt",
      description: "Total number of invoices without goods receipts",
      signalFragment:
        "COUNT(case_id)\n\tFILTER (WHERE NOT EVENT_NAME  MATCHES (${itp_goods_receipt_events})\n\t\tAND EVENT_NAME  MATCHES (${itp_invoice_posting_events}))",
      variables: [
        {
          name: "itp_goods_receipt_events",
          description:
            "Events identifying that the goods have been shipped, for example 'Record Goods Issue'",
          defaultValues: [],
        },
        {
          name: "itp_invoice_posting_events",
          description:
            "Events identifying the posting of invoice items, for example 'Post Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_payment_block_rate",
      name: "Payment block rate",
      description: "Percentage of all invoices where a payment block was set",
      signalFragment:
        "COUNT(case_id)\n\tFILTER (WHERE event_name MATCHES (${itp_set_payment_block_events}))\n/ COUNT(case_id) \n* 100",
      variables: [
        {
          name: "itp_set_payment_block_events",
          description:
            "Event identifying the setting of a payment block for an invoice, for example 'Set Payment Block'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_parked_invoices",
      name: "Parked invoices",
      description: "Invoices that have been parked before being posted",
      signalFragment:
        "COUNT(case_id) FILTER(\n\tWHERE event_name MATCHES(${itp_parked_invoices}))",
      variables: [
        {
          name: "itp_parked_invoices",
          description:
            "Event that describes invoices that are parked, for example 'Park Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_manual_invoice_posting",
      name: "Manual invoice posting",
      description:
        "Invoices that have been posted manually, for example by a dialog user",
      signalFragment:
        "SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE (event_name IN (${itp_invoice_posting_events})\n\t\t\tAND (${itp_manual_condition})))))",
      variables: [
        {
          name: "itp_invoice_posting_events",
          description:
            "Events identifying the posting of invoice items, for example 'Post Invoice'",
          defaultValues: [],
        },
        {
          name: "itp_manual_condition",
          description:
            "Condition indicating that an event was manual, for example \"Event Created By User Type\" = 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_currently_blocked_invoices",
      name: "Currently blocked invoices",
      description: "Invoices that are currently blocked from being paid",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${itp_set_payment_block_events})\n\t\tAND NOT event_name MATCHES(${itp_remove_payment_block_events})\n\t\tAND NOT event_name MATCHES(${itp_clear_invoice_events}))",
      variables: [
        {
          name: "itp_set_payment_block_events",
          description:
            "Event identifying the setting of a payment block for an invoice, for example 'Set Payment Block'",
          defaultValues: [],
        },
        {
          name: "itp_remove_payment_block_events",
          description:
            "Event identifying the removal of a payment block for an invoice, for example 'Remove Payment Block'",
          defaultValues: [],
        },
        {
          name: "itp_clear_invoice_events",
          description:
            "Event identifying the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_payment_terms_differences",
      name: "Payment Terms Differences",
      description:
        "Number of invoices for which the payment terms on the invoice differ from the payment terms on the purchase order",
      signalFragment:
        "COUNT(case_id) FILTER(\n\tWHERE (${itp_invoice_payment_terms}) \n\t\t<> (CASE WHEN ${itp_purchase_order_payment_terms} IS NULL THEN 0 \n\tELSE ${itp_purchase_order_payment_terms} END))",
      variables: [
        {
          name: "itp_invoice_payment_terms",
          description:
            'Attribute referring to the invoice payment terms in days, for example "Last Inv. Item Net Payment Terms Period"',
          defaultValues: [],
        },
        {
          name: "itp_purchase_order_payment_terms",
          description:
            'Attribute referring to the purchase order payment terms in days, for example "Last PO Net Payment Days"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_price_inconsistency_invoice_and_purchase_order",
      name: "Price difference on the invoice compared to the purchase order",
      description:
        "Number of invoices with different prices compared to the purchase order",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${itp_different_price_condition}))",
      variables: [
        {
          name: "itp_different_price_condition",
          description:
            'Condition showing if there are different prices between purchase order and invoice, for example "PO Item Total Net Order Value" \n<> "Inv. Amount in Document Currency"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_automation_remove_payment_block",
      name: "Automatic payment block removal",
      description:
        "Number of invoices where payment blocks where removed by non-dialog users",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${itp_remove_payment_block_events}))\n\t\tAND NOT (${itp_automatic_condition_nested}))",
      variables: [
        {
          name: "itp_remove_payment_block_events",
          description:
            "Event identifying the removal of a payment block for an invoice, for example 'Remove Payment Block'",
          defaultValues: [],
        },
        {
          name: "itp_automatic_condition_nested",
          description:
            "Condition indicating that an event was manual, for example \"Event Created By User Type\" MATCHES('Dialog')",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_purchase_orders_created_after_invoice_receipt",
      name: "Late purchase order creation",
      description:
        "Total number of invoices where the purchase order item was created after the invoice creation",
      signalFragment:
        "COUNT(case_id) FILTER(\n\tWHERE (event_name MATCHES(\n(${itp_incompliant_activity_order}))))",
      variables: [
        {
          name: "itp_incompliant_activity_order",
          description:
            "Order of events identifying that a purchase order was created after the invoice was created by the vendor, for example 'Vendor Creates Invoice' ~> 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_immediate_payment",
      name: "Invoices with immediate payment terms",
      description:
        "Number of invoices where the payment terms (BSEG.ZBD1T) are 0 or NULL",
      signalFragment:
        "COUNT(case_id) FILTER(\n\tWHERE ${itp_cash_discount_terms} IS NULL\n\t\tOR ${itp_cash_discount_terms} = 0)",
      variables: [
        {
          name: "itp_cash_discount_terms",
          description:
            'Terms that determine after which time an invoice needs to be paid, for example "Last Inv. Item Cash Discount Days 1" BSEG.ZBD1t',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "INVOICE_TO_PAY_lost_cd_on_early_payment",
      name: "Lost cash discount despite in-time payment",
      description:
        "Amount of lost cash discounts in USD even though the invoice was paid in time for cash discount collection",
      signalFragment:
        "SUM(\n\t(${itp_amount_conv} * ${itp_discount_percentage})\n\t-${itp_discount_applied_to_invoice}\n\t)\nFILTER(\n\tWHERE EVENT_NAME MATCHES (${itp_cd_in_time}))",
      variables: [
        {
          name: "itp_amount_conv",
          description:
            'Attribute identifying the amount (converted to USD) of an invoice, for example "Inv. Converted USD Amount"',
          defaultValues: [],
        },
        {
          name: "itp_discount_percentage",
          description:
            'Attribute referring to the maximum percentage discount that can be applied to the total amount of an invoice item, for example "Last Inv. Item Cash Discount Percentage1"',
          defaultValues: [],
        },
        {
          name: "itp_discount_applied_to_invoice",
          description:
            'Attribute referring to the actual cash discount applied when the invoice was paid, for example "Inv. Converted USD Cash Discount Amount"',
          defaultValues: [],
        },
        {
          name: "itp_cd_in_time",
          description:
            "Order of events identifying that an invoice was paid in time for collection of cash discount 1, for example 'Clear Invoice'~>('Cash Discount 1 Due Date passed'|'Cash Discount 2 Due Date passed')",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "INVOICE_TO_PAY",
          name: "Invoice-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_total_nr_open_opp",
      name: "Total number of open opportunities",
      description: "Total number of currently open opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_AND( NOT event_name IN (${close_opp_events})))\n\t)",
      variables: [
        {
          name: "close_opp_events",
          description:
            "Events indicating that an opportunity was closed, for example 'Update Opportunity Stage to: Closed Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_total_nr_closed_opp",
      name: "Total number of closed opportunities",
      description: "Total number of currently closed opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${close_opp_events})))\n\t)",
      variables: [
        {
          name: "close_opp_events",
          description:
            "Events indicating that an opportunity was closed, for example 'Update Opportunity Stage to: Closed Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_total_nr_won_opp",
      name: "Total number of won opportunities",
      description: "Total number of won opportunities",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${opp_won_condition})\n\t)",
      variables: [
        {
          name: "opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"OppIsWon\" = 'TRUE'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_win_ratio",
      name: "Win/loss ratio",
      description:
        "Ratio of won to lost opportunities. A value > 1 indicates that there are more opportunities won than lost.",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (${opp_won_condition}))\n)\n/\n(COUNT(case_id) FILTER (\n\tWHERE (${opp_lost_condition}))\n)",
      variables: [
        {
          name: "opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"OppIsWon\" = 'TRUE'",
          defaultValues: [],
        },
        {
          name: "opp_lost_condition",
          description:
            "Condition indicating that an opportunity is lost, for example \"OppIsWon\" = 'FALSE'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_lead_conversion_time",
      name: "Average lead conversion time",
      description: "Average time from lead creation to lead conversion",
      signalFragment:
        "AVG(\n\t${lead_converted_date} - ${lead_created_date}\n   )",
      variables: [
        {
          name: "lead_converted_date",
          description:
            'Attribute that contains the conversion date of a lead, for example "LeadConvertedDate"',
          defaultValues: [],
        },
        {
          name: "lead_created_date",
          description:
            'Attribute containing the creation date of a lead, for example "LeadCreatedDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_lead_response_time",
      name: "Average lead response time",
      description: "Average time from lead creation to working on lead",
      signalFragment:
        "AVG(\n\t(SELECT FIRST(end_time) FILTER (\n\t\tWHERE NOT event_name IN (${lead_created_events})))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE event_name IN (${lead_created_events})))\n   )",
      variables: [
        {
          name: "lead_created_events",
          description:
            "Events indicating that a lead was created, for example 'Create Lead'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_opp_won_time",
      name: "Average opportunity win time",
      description:
        "Average time from creating the opportunity to winning the opportunity",
      signalFragment:
        "AVG(${opp_closed_date} - ${opp_created_date}) FILTER (\n\tWHERE (${opp_won_condition})\n\t)",
      variables: [
        {
          name: "opp_closed_date",
          description:
            'Attribute containing the closing date of an opportunity, for example "OppCloseDate"',
          defaultValues: [],
        },
        {
          name: "opp_created_date",
          description:
            'Attribute containing the creation date of an opportunity, for example "OppCreatedDate"',
          defaultValues: [],
        },
        {
          name: "opp_won_condition",
          description:
            "Condition indicating that an opportunity is won, for example \"OppIsWon\" = 'TRUE'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_opp_lost_time",
      name: "Average opportunity lost time",
      description:
        "Average time from creating the opportunity to loosing the opportunity",
      signalFragment:
        "AVG(${opp_closed_date} - ${opp_created_date}) FILTER (\n\tWHERE (${opp_lost_condition})\n\t)",
      variables: [
        {
          name: "opp_closed_date",
          description:
            'Attribute containing the closing date of an opportunity, for example "OppCloseDate"',
          defaultValues: [],
        },
        {
          name: "opp_created_date",
          description:
            'Attribute containing the creation date of an opportunity, for example "OppCreatedDate"',
          defaultValues: [],
        },
        {
          name: "opp_lost_condition",
          description:
            "Condition indicating that an opportunity is lost, for example \"OppIsWon\" = 'FALSE'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_opp_wo_lead",
      name: "Opportunities without lead",
      description: "Total number of opportunities without lead",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${lead_identifier} IS NULL\n\t)",
      variables: [
        {
          name: "lead_identifier",
          description: 'Attribute that identifies a lead, for example "LeadId"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_touchpoints",
      name: "Average touchpoints per case",
      description: "Average number of touchpoints per case",
      signalFragment:
        "AVG((SELECT COUNT(event_name) FILTER (\n\tWHERE event_name IN (${touchpoint_events})))\n\t)",
      variables: [
        {
          name: "touchpoint_events",
          description:
            "Events that describe a touchpoint, for example 'Log Activity: Call', 'Log Activity: Email'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_no_touch_leads",
      name: "No-touch leads",
      description: "Percentage of leads without interactions",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE \n\t\t(SELECT \n\t\t\tBOOL_AND( NOT event_name IN (${touchpoint_events})) \n\t\t\tAND BOOL_OR( event_name IN (${lead_created_events})) \n\t\t)\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "touchpoint_events",
          description:
            "Events that describe a touchpoint, for example 'Log Activity: Call', 'Log Activity: Email'",
          defaultValues: [],
        },
        {
          name: "lead_created_events",
          description:
            "Events indicating that a lead was created, for example 'Create Lead'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_low_touch_conversions",
      name: "Low-touch conversions",
      description:
        "Number of converted leads with less interactions than specified",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE \n\t\t(SELECT COUNT(event_name) FILTER \n\t\t\t(WHERE event_name IN (${touchpoint_events})) \n\t\t) < ${number_of_touchpoints}\n\t\tAND (SELECT BOOL_OR(event_name IN (${conversion_events})) \n\t\t) \n\t)",
      variables: [
        {
          name: "touchpoint_events",
          description:
            "Events that describe a touchpoint, for example 'Log Activity: Call', 'Log Activity: Email'",
          defaultValues: [],
        },
        {
          name: "number_of_touchpoints",
          description:
            'Threshold for classifying a case as "low-touch case", for example 3',
          defaultValues: [],
        },
        {
          name: "conversion_events",
          description:
            "Events indicating that a case was converted, for example 'Update Opportunity Stage to: Closed Won', 'Lead Converted'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
        {
          id: "LEAD_TO_OPPORTUNITY",
          name: "Lead-to-Opportunity",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_created_quotes",
      name: "Number of created quotes",
      description: "Number of created quotes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${quote_created})))\n\t)",
      variables: [
        {
          name: "quote_created",
          description:
            "Events indicating that a quote was created, for example 'Create Quote'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_approved_quotes",
      name: "Number of approved quotes",
      description: "Number of approved quotes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${quote_approved})))\n\t)",
      variables: [
        {
          name: "quote_approved",
          description:
            "Events indicating that a quote was approved, for example 'Approve Quote'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_rejected_quotes",
      name: "Number of rejected quotes",
      description: "Number of rejected quotes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${quote_rejected})))\n\t)",
      variables: [
        {
          name: "quote_rejected",
          description:
            "Events indicating that a quote was rejected, for example 'Reject Quote'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_quote_to_close_ratio",
      name: "Quote to close ratio",
      description: "Fraction of quotes that end up as won opportunities.",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${quote_to_opp_condition}))\n/ COUNT(case_id))\n* 100",
      variables: [
        {
          name: "quote_to_opp_condition",
          description:
            "Sequence of events that describes the process of quotes ending up as won opportunities, for example 'Create Quote' ~> 'Update Opportunity Stage to: Closed Won'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_total_quote_volume",
      name: "Total quote volume",
      description:
        "Total financial volume of quotes provided to potential clients.",
      signalFragment:
        'SUM("OppAmount") FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${quote_created})))\n\t)',
      variables: [
        {
          name: "quote_created",
          description:
            "Events indicating that a quote was created, for example 'Create Quote'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "LEAD_TO_QUOTE_avg_quote_volume",
      name: "Average quote volume",
      description:
        "Average financial volume of quotes provided to potential clients.",
      signalFragment:
        'AVG("OppAmount") FILTER (\n\tWHERE (SELECT BOOL_OR( event_name IN (${quote_created})))\n\t)',
      variables: [
        {
          name: "quote_created",
          description:
            "Events indicating that a quote was created, for example 'Create Quote'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [
        {
          id: "LEAD_TO_QUOTE",
          name: "Lead-to-Quote",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_perc_hired_candidates",
      name: "Percentage of Hired Candidates",
      description:
        "Percentage of job applications that result in a hiring event",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\tWHERE event_name IN (${hiring_events}))\n\t> 0)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "hiring_events",
          description:
            "List of events indicating that the job application resulted in a hire (candidate was hired), e.g. 'Hired'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: [
        {
          id: "ATTRACT_TO_ACQUIRE_TALENT",
          name: "Attract-to-Acquire Talent",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_hired_candidates",
      name: "Number of Hired Candidates",
      description: "Number of job applications that result in a hiring event",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\tWHERE event_name IN (${hiring_events}))\n\t> 0)",
      variables: [
        {
          name: "hiring_events",
          description:
            "List of events indicating that the job application resulted in a hire (candidate was hired), e.g. 'Hired'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: [
        {
          id: "ATTRACT_TO_ACQUIRE_TALENT",
          name: "Attract-to-Acquire Talent",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_avg_time_to_hire",
      name: "Average Time to Hire",
      description:
        "Average Time Between Job Application Received and Candidate Hired",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER (\n\t\tWHERE (event_name IN (${hiring_events}))))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE (event_name IN (${job_application_creation_events}))))\n)",
      variables: [
        {
          name: "hiring_events",
          description:
            "List of events indicating that the job application resulted in a hire (candidate was hired), e.g. 'Hired'",
          defaultValues: [],
        },
        {
          name: "job_application_creation_events",
          description:
            "List of events indicating that the job application was created, e.g. 'Create Job Application'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: [
        {
          id: "ATTRACT_TO_ACQUIRE_TALENT",
          name: "Attract-to-Acquire Talent",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_avg_time_to_fill",
      name: "Average Time to Fill",
      description:
        "Average Time Between Job Requisition Created and Position Filled",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER (\n\t\tWHERE (event_name IN (${hiring_events}))))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE (event_name IN (${job_requisition_creation_events}))))\n)",
      variables: [
        {
          name: "hiring_events",
          description:
            "List of events indicating that the job application resulted in a hire (candidate was hired), e.g. 'Hired'",
          defaultValues: [],
        },
        {
          name: "job_requisition_creation_events",
          description:
            "List of events indicating that the job requisition was created, e.g. 'Create Job Requisition'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: [
        {
          id: "ATTRACT_TO_ACQUIRE_TALENT",
          name: "Attract-to-Acquire Talent",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_avg_time_to_extend_offer",
      name: "Average Time to Extend Job Offer",
      description:
        "Average Time Between Candidate Selected by Hiring Manager and Offer Extended to Candidate",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER (\n\t\tWHERE (event_name IN (${offer_extended_events}))))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE (event_name IN (${hiring_manager_hired_events}))))\n)",
      variables: [
        {
          name: "offer_extended_events",
          description:
            "List of events indicating that the job offer has been extended to the candidate, e.g. 'Offer Extended'",
          defaultValues: [],
        },
        {
          name: "hiring_manager_hired_events",
          description:
            "List of events indicating that the candidate has been selected by the hiring manager, e.g. 'Prepare Offer'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: [
        {
          id: "ATTRACT_TO_ACQUIRE_TALENT",
          name: "Attract-to-Acquire Talent",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ATTRACT_TO_ACQUIRE_TALENT_num_open_job_requisitions",
      name: "Number of Open Job Requisitions",
      description:
        "The number of currently open job requisitions, based on the count of unique Job Requisition IDs and their Job Requisition Status",
      signalFragment:
        'COUNT(DISTINCT "Job Requisition ID") FILTER (\n\tWHERE "Job Requisition Status" IN (${job_req_status_open}))',
      variables: [
        {
          name: "job_req_status_open",
          description:
            "List of Job Requisition status entries that indicate a Job Requisition is still open, e.g. 'Open'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SFSF"],
      processTypes: [
        {
          id: "ATTRACT_TO_ACQUIRE_TALENT",
          name: "Attract-to-Acquire Talent",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "avg_cycle_time",
      name: "Average cycle time",
      description:
        "Average cycle time calculated from the first to the last event",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)) - (SELECT FIRST(end_time))\n   )",
      category: "Cycle Time",
      variables: [],
      sourceSystems: [],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "avg_custom_cycle_time",
      name: "Average custom cycle time",
      description:
        "Average cycle time between two events of interest to the user",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER (\n\t\tWHERE (event_name IN (${end_events}))))\n\t-(SELECT FIRST(end_time) FILTER (\n\t\tWHERE (event_name IN (${start_events}))))\n   )",
      category: "Cycle Time",
      variables: [
        {
          name: "end_events",
          description:
            "Events defining the end point of the process for the cycle time calculation, for example 'Post Goods Issue'",
          defaultValue: "'Assign Incident to User'",
          defaultValues: ["'Assign Incident to User'"],
        },
        {
          name: "start_events",
          description:
            "Events defining the starting point of the process for the cycle time calculation, for example 'Create Sales Order Item'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "avg_cycle_time_open_cases",
      name: "Average cycle time for open cases",
      description: "Average cycle time for all currently open cases",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))) FILTER (\n\t\tWHERE (SELECT FIRST(event_name) FILTER (\n\t\t\tWHERE event_name IN (${closing_events}))) IS NULL\n   )",
      category: "Cycle Time",
      variables: [
        {
          name: "closing_events",
          description:
            "Events defining the closing of a case, for example 'Clear Invoice', 'Update Opportunity Stage to: Closed Won', 'Reject Quote'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "planned_actual_cycle_time_ratio",
      name: "Ratio between planned and actual average cycle time",
      description:
        "Comparison between planned and actual average cycle time: when > 1 then the actual cycle time is smaller than that planned",
      signalFragment:
        "(DURATION ${threshold_cycle_time})/\nAVG(\n\t(\n\t\t(SELECT LAST(end_time) WHERE event_name\n\t\t\tIN (${end_events})\n\t)\n\t-\n(SELECT FIRST(end_time) WHERE event_name\n\t\t\tIN (${start_events})\n)\n)\n )",
      category: "Cycle Time",
      variables: [
        {
          name: "threshold_cycle_time",
          description: "Threshold cycle time, for example '4hours'",
          defaultValue: "'4hours'",
          defaultValues: ["'4hours'"],
        },
        {
          name: "end_events",
          description:
            "Events defining the end point of the process for the cycle time calculation, for example 'Post Goods Issue'",
          defaultValue: "'Assign Incident to User'",
          defaultValues: ["'Assign Incident to User'"],
        },
        {
          name: "start_events",
          description:
            "Events defining the starting point of the process for the cycle time calculation, for example 'Create Sales Order Item'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_timely_execution",
      name: "Percentage of cases executed in less than a given time",
      description:
        "Percentage of cases executed in less than a given time threshold",
      signalFragment:
        "count(case_id)\n\tFILTER (WHERE \n\t\t\t(SELECT LAST(end_time) FILTER (WHERE event_name\n\t\t\tIN (${end_events}))\n\t\t-\n\tFIRST(end_time) FILTER (WHERE event_name\n\t\t\tIN (${start_events}))\n\t\t) < DURATION ${threshold_cycle_time}\n)\n/ COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${end_events})))\n\t) * 100",
      category: "Cycle Time",
      variables: [
        {
          name: "end_events",
          description:
            "Events defining the end point of the process for the cycle time calculation, for example 'Post Goods Issue'",
          defaultValue: "'Assign Incident to User'",
          defaultValues: ["'Assign Incident to User'"],
        },
        {
          name: "start_events",
          description:
            "Events defining the starting point of the process for the cycle time calculation, for example 'Create Sales Order Item'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
        {
          name: "threshold_cycle_time",
          description: "Threshold cycle time, for example '4hours'",
          defaultValue: "'4hours'",
          defaultValues: ["'4hours'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_avg_sales_order_processing_time",
      name: "Average processing time for sales orders",
      description:
        "Average time from the creation of a sales order item to its complete processing",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${processing_completion_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${sales_order_item_creation_events}))\n\t)",
      variables: [
        {
          name: "processing_completion_events",
          description:
            "Events identifying when a sales order is processed, for example 'Sales Order Completely Processed'",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_otc_avg_invoice_payment_time",
      name: "Average invoice payment time",
      description:
        "Average number of days that it takes a company to collect payment after a sale",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${billing_clearing_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${billing_creation_events}))\n\t)\n",
      variables: [
        {
          name: "billing_clearing_events",
          description:
            "Events identifying that an invoice was cleared, for example 'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "billing_creation_events",
          description:
            "Events identifying the creation of invoices, for example 'Create Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_return_rate",
      name: "Return rate",
      description: "Percentage of cases in which an item was returned",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR (event_name ${return_order_events})\n\t))\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "return_order_events",
          description:
            "Events identifying that a sales order was returned, for example 'Create Return Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_on_time_delivery",
      name: "On-time delivery rate",
      description:
        "Percentage of deliveries arriving at their destination before or on the expected date",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\t\tWHERE (${ontime_delivery_condition})) > 0\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${outbound_delivery_creation_events})))\n\t) \n* 100\n",
      variables: [
        {
          name: "ontime_delivery_condition",
          description:
            "Condition defining that a delivery is on time, for example \"DeliveryGoodsMovementOnTime\" = 'Yes'",
          defaultValues: [],
        },
        {
          name: "outbound_delivery_creation_events",
          description:
            "Events identifying that an Outbound Delivery has been created, for example: 'Create Outbound Delivery'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_otc_late_payment_rate",
      name: "Late payment rate",
      description:
        "Percentage of cases where the invoice was cleared after its due date",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\t\tWHERE (${invoice_overdue_condition})) > 0\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${billing_clearing_events})))\n\t) \n* 100\n",
      variables: [
        {
          name: "invoice_overdue_condition",
          description:
            'Condition defining that an invoice was cleared after the due date, for example "InvoiceAccountingClearingDate" > "InvoiceDueDate"',
          defaultValues: [],
        },
        {
          name: "billing_clearing_events",
          description:
            "Events identifying that an invoice was cleared, for example 'Clear Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_no_payment_rate",
      name: "No payment rate",
      description:
        "Percentage of cases where the invoice is overdue and not cleared",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\t\tWHERE ((${open_accounts_receivable_condition})\n\t\t\tAND (${no_payment_condition}))) > 0\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${billing_creation_events})))\n\t) \n* 100\n",
      variables: [
        {
          name: "open_accounts_receivable_condition",
          description:
            'Condition defining that an invoice has not been cleared so far, although it was expected to. For example: NOW() > "InvoiceDueDate"',
          defaultValues: [],
        },
        {
          name: "no_payment_condition",
          description:
            'Condition defining that an invoice was not cleared, for example "InvoiceAccountingClearingDate" IS NULL',
          defaultValues: [],
        },
        {
          name: "billing_creation_events",
          description:
            "Events identifying the creation of invoices, for example 'Create Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_dunning_rate",
      name: "Dunning rate",
      description: "Percentage of cases where the invoice is dunned",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${dunning_condition})\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "dunning_condition",
          description:
            'Condition defining that an invoice has already been dunned, for example "InvoiceLastDunnedOn" IS NOT NULL',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_avg_sales_doc_to_delivery_creation_time",
      name: "Lead time: sales document item creation to delivery creation",
      description:
        "Average lead time from the event 'Create Sales Order Item' to the event 'Create Outbound Delivery'",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${outbound_delivery_creation_events}) AND\n\t\t((NOW() - LAST(end_time)) < DURATION ${outbound_delivery_period})\n\t\t)\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${sales_order_item_creation_events})\n\t\t)\n\t)",
      variables: [
        {
          name: "outbound_delivery_creation_events",
          description:
            "Events identifying that an Outbound Delivery has been created, for example: 'Create Outbound Delivery'",
          defaultValues: [],
        },
        {
          name: "outbound_delivery_period",
          description:
            "Reference time period in which outbound deliveries have been created, counting backward from today, for example: '7days'",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_avg_invoice_creation_clearing_time",
      name: "Lead time: invoice creation to accounts receivable clearing",
      description:
        "Average lead time for items that were cleared within a reference period",
      signalFragment:
        'AVG(\n\t(SELECT LAST("InvoiceAccountingClearingDate") WHERE \n\t\t((NOW() - LAST(end_time)) < DURATION ${invoice_clearing_period}))\n\t-(SELECT FIRST(${invoice_reference_date})WHERE \n\t\t((NOW() - LAST(end_time)) < DURATION ${invoice_posting_period}))\n\t)',
      variables: [
        {
          name: "invoice_clearing_period",
          description:
            "Reference time period to monitor cleared invoices, for example, for invoices that were cleared during last week: '7days'",
          defaultValues: [],
        },
        {
          name: "invoice_reference_date",
          description:
            'Attributes identifying which field of the accounting document is used for the calculation of the lead time, for example: "InvoiceAccountingDocumentDate"',
          defaultValues: [],
        },
        {
          name: "invoice_posting_period",
          description:
            "Reference time period to monitor invoices that have been paid, for example, for payments that have been paid at least 1 day ago: '1days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_rejected_sales_document_items",
      name: "Rejected sales document items",
      description:
        "Number of rejected sales order items that were created within a time period",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${sales_order_item_creation_events})) \n\t\tAND ((NOW() - LAST(end_time)) < DURATION ${sales_order_item_creation_period})\n\t)\n\tAND (SELECT BOOL_OR(event_name = 'Reject Sales Doc Item')\n\t\tAND ((NOW() - LAST(end_time)) < DURATION ${rejected_orders_reference_period}))\n\t)\n)",
      variables: [
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_period",
          description:
            "Reference time period to monitor sales order items that were created, for example, for sales order items that were created during last week: '7days'",
          defaultValues: [],
        },
        {
          name: "rejected_orders_reference_period",
          description:
            "Reference time period to monitor sales order items that were rejected, for example, for sales order items that were rejected during last week: '7days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_return_order_items_created",
      name: "Return order items created",
      description:
        "Number of return order items that were created within a time period",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${sales_order_item_creation_events})) \n\t\tAND ((NOW() - LAST(end_time)) < DURATION ${sales_order_item_creation_period})\n\t)\n\tAND (SELECT BOOL_OR(event_name = 'Create Return Sales Order Item')\n\t\tAND ((NOW() - LAST(end_time)) < DURATION ${returned_orders_reference_period}))\n\t)\n)",
      variables: [
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_period",
          description:
            "Reference time period to monitor sales order items that were created, for example, for sales order items that were created during last week: '7days'",
          defaultValues: [],
        },
        {
          name: "returned_orders_reference_period",
          description:
            "Reference time period to monitor sales order items that were returned, for example, for sales order items that were returned during last week: '7days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_deleted_sales_document_items",
      name: "Deleted sales document items",
      description:
        "Number of deleted items in sales documents within a defined period of time",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\tSELECT BOOL_OR(event_name IN (${delete_sales_order_item_events}))\n\t\tAND NOW() - LAST(end_time) < DURATION ${sales_order_item_deletion_period}\n\t)\n)",
      variables: [
        {
          name: "delete_sales_order_item_events",
          description:
            "Events identifying that a sales order item was deleted, for example: 'Delete Sales Doc Item'",
          defaultValues: [],
        },
        {
          name: "sales_order_item_deletion_period",
          description:
            "Reference time period to monitor sales order items that were deleted, for example, for sales order items that were deleted during last week: '7days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_automation_rate_sales_doc_creation",
      name: "Automation rate: sales document creation",
      description:
        "Percentage of automated sales order creation events within a time period",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (\n\t\t(SELECT BOOL_OR(event_name IN (${sales_order_doc_creation_events})\n\t\t AND (${otc_automation_condition}))\n\t\t AND ((NOW() - LAST(end_time)) < DURATION ${sales_order_doc_creation_period})) \n\t)\n) / SUM((SELECT COUNT(event_name)))\n* 100",
      variables: [
        {
          name: "sales_order_doc_creation_events",
          description:
            "Events referring to the creation of any sales document, for example: 'Create Sales Order Item', 'Create Contract Item'",
          defaultValues: [],
        },
        {
          name: "otc_automation_condition",
          description:
            "Attributes indicating that an event was automated, for example: \"EventCreatedByUserType\" != 'Dialog'",
          defaultValues: [],
        },
        {
          name: "sales_order_doc_creation_period",
          description:
            "Reference time period to monitor sales order documents that were created, for example, for sales order documents that were created during last week: '7days'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_overdue_and_open_ar_items",
      name: "Overdue and open Accounts Receivable items",
      description: "Number of overdue open customer items",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\t\tWHERE (${invoice_overdue_condition} OR ${open_accounts_receivable_condition})) > 0\n\t)",
      variables: [
        {
          name: "invoice_overdue_condition",
          description:
            'Condition defining that an invoice was cleared after the due date, for example "InvoiceAccountingClearingDate" > "InvoiceDueDate"',
          defaultValues: [],
        },
        {
          name: "open_accounts_receivable_condition",
          description:
            'Condition defining that an invoice has not been cleared so far, although it was expected to. For example: NOW() > "InvoiceDueDate"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_avg_invoice_customer_process_time",
      name: "Average invoice customer process time",
      description:
        "Average time from the posting of goods issue to the creation of an invoice",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) WHERE event_name IN (${billing_creation_events}))\n\t-\n\t(SELECT FIRST(end_time) WHERE event_name IN (${shipping_events}))\n)",
      variables: [
        {
          name: "billing_creation_events",
          description:
            "Events identifying the creation of invoices, for example 'Create Invoice'",
          defaultValues: [],
        },
        {
          name: "shipping_events",
          description:
            "Events identifying that the goods have been shipped, for example 'Post Goods Issue'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_tot_nr_sales_orders",
      name: "Total number of sales orders",
      description: "Total amount of orders on header level",
      signalFragment:
        "COUNT(DISTINCT SalesDocId) FILTER (\n\t WHERE (SELECT BOOL_OR(event_name IN (${sales_order_item_creation_events}))))",
      variables: [
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_no_touch_order_rate",
      name: "No-Touch-Order Rate",
      description:
        "Percentage of “perfect orders” or no-touch orders, i.e. delivered on time, with the right amount and no other changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name IN (${processing_completion_events})\n\t\tAND ${ontime_delivery_condition}\n\t\tAND event_name NOT ${otc_change_events})\n\t)\n)/COUNT(case_id)\n* 100",
      variables: [
        {
          name: "processing_completion_events",
          description:
            "Events identifying when a sales order is processed, for example 'Sales Order Completely Processed'",
          defaultValues: [],
        },
        {
          name: "ontime_delivery_condition",
          description:
            "Condition defining that a delivery is on time, for example \"DeliveryGoodsMovementOnTime\" = 'Yes'",
          defaultValues: [],
        },
        {
          name: "otc_change_events",
          description:
            "Events referring to changes made to the sales doc item, for example: 'Change Sales Doc Item Price'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_price_change_rate",
      name: "Price Change Rate",
      description: "Percentage of cases with SD Item price changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name ${price_change_events})))\n/ COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${sales_order_item_creation_events}))))\n* 100",
      variables: [
        {
          name: "price_change_events",
          description:
            "Events referring to price changes made to the sales doc item",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_delivery_change_rate",
      name: "Delivery Change Rate",
      description: "Percentage of cases with SD Item delivery changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name ${update_delivery_events})))\n/ COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${sales_order_item_creation_events}))))\n* 100",
      variables: [
        {
          name: "update_delivery_events",
          description:
            "Events referring to delivery changes made to the sales doc item",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_material_change_rate",
      name: "Material Change Rate",
      description: "Percentage of cases with SD Item material changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${update_material_events}))))\n/ COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${sales_order_item_creation_events}))))\n* 100",
      variables: [
        {
          name: "update_material_events",
          description:
            "Events indicating material changes made to the sales doc item",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "ORDER_TO_CASH_quantity_change_rate",
      name: "Quantity change rate",
      description: "Percentage of cases with SD Item quantity changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${update_quantity_events}))))\n/ COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES((${sales_order_item_creation_events}))))\n* 100",
      variables: [
        {
          name: "update_quantity_events",
          description:
            "Events indicating quantity changes made to the sales doc item",
          defaultValues: [],
        },
        {
          name: "sales_order_item_creation_events",
          description:
            "Events identifying the creation of a sales order, for example 'Create Sales Order Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "ORDER_TO_CASH",
          name: "Order-to-Cash",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "automation_rate",
      name: "Automation rate",
      description: "Percentage of automated events",
      signalFragment:
        "SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE (${automation_condition}))\n\t)\n\t)\n/ SUM((SELECT COUNT(event_name)))\n* 100",
      category: "Automation",
      variables: [
        {
          name: "automation_condition",
          description:
            "Attributes indicating that an event was automated, for example \"EventCreatedByUserType\" != 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA", "SAP_ISU"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "automation_rate_potential",
      name: "Automation rate potential",
      description: "Percentage of events that could be automated",
      signalFragment:
        "SUM(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE (${automation_potential_condition}))\n\t)\n\t)\n/ SUM((SELECT COUNT(event_name)))\n* 100",
      category: "Automation",
      variables: [
        {
          name: "automation_potential_condition",
          description:
            "Attributes indicating that an event was not automated yet or should not be automated, for example \"EventCreatedByUserType\" = 'Dialog' AND (event_name <> 'Create Invoice Item')",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA", "SAP_ISU"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "automation_rate_events",
      name: "Automation rate over events",
      description: "Percentage of automated events",
      signalFragment:
        "count(event_name) FILTER \n(WHERE (${automation_condition})) \n/ count(event_name) * 100",
      category: "Automation",
      variables: [
        {
          name: "automation_condition",
          description:
            "Attributes indicating that an event was automated, for example \"EventCreatedByUserType\" != 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA", "SAP_ISU"],
      processTypes: [],
      aggregationType: "EVENT",
      releaseDate: "2022-12-08",
    },
    {
      id: "avg_nr_changes_per_case",
      name: "Average number of changes per case",
      description: "Average number of change events per case",
      signalFragment:
        "AVG(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE event_name ${change_events})))",
      category: "Changes",
      variables: [
        {
          name: "change_events",
          description:
            "Events referring to changes made to the case, for example ILIKE '%Update%'",
          defaultValue: " = 'Incident On Hold'",
          defaultValues: [" = 'Incident On Hold'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_change_events_per_case",
      name: "Percentage of change events per case",
      description: "Average percentage of change events per case",
      signalFragment:
        "AVG(\n\t(SELECT COUNT(event_name) FILTER (\n\t\tWHERE event_name ${change_events})\n\t) / (SELECT COUNT(event_name))\n\t) * 100",
      category: "Changes",
      variables: [
        {
          name: "change_events",
          description:
            "Events referring to changes made to the case, for example ILIKE '%Update%'",
          defaultValue: " = 'Incident On Hold'",
          defaultValues: [" = 'Incident On Hold'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_cases_with_changes",
      name: "Percentage of cases with changes",
      description: "Percentage of cases that contain change events",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name ${change_events})))\n/ COUNT(case_id)\n* 100",
      category: "Changes",
      variables: [
        {
          name: "change_events",
          description:
            "Events referring to changes made to the case, for example ILIKE '%Update%'",
          defaultValue: " = 'Incident On Hold'",
          defaultValues: [" = 'Incident On Hold'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_cases_with_manual_changes",
      name: "Percentage of cases with manual changes",
      description:
        "Percentage of cases that contain change events executed manually",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT BOOL_OR(event_name ${change_events}) AND BOOL_OR(${manual_changes_condition})))\n/ COUNT(case_id)\n* 100",
      category: "Changes",
      variables: [
        {
          name: "change_events",
          description:
            "Events referring to changes made to the case, for example ILIKE '%Update%'",
          defaultValue: " = 'Incident On Hold'",
          defaultValues: [" = 'Incident On Hold'"],
        },
        {
          name: "manual_changes_condition",
          description:
            "Attributes indicating that an event was executed manually, for example \"EventCreatedByUserType\" = 'Dialog'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA", "SAP_ISU"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "dropout_number",
      name: "Number of dropouts",
      description:
        "Number of cases that were started and not successfully completed",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT LAST(event_name) IN (${dropout_events}))\n   )",
      category: "Dropouts",
      variables: [
        {
          name: "dropout_events",
          description:
            "Events that identify a dropout case, for example 'Reject Quote', 'Update Opportunity Stage to: Dead - No Decision'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "dropout_rate",
      name: "Dropout rate",
      description:
        "Percentage of cases that were started and not successfully completed",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT LAST(event_name) IN (${dropout_events})))\n/ COUNT(case_id)\n* 100",
      category: "Dropouts",
      variables: [
        {
          name: "dropout_events",
          description:
            "Events that identify a dropout case, for example 'Reject Quote', 'Update Opportunity Stage to: Dead - No Decision'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "nr_idle_cases",
      name: "Number of idle cases",
      description:
        "Number of cases that are open long enough to qualify as dropouts",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOW() - (SELECT LAST(end_time)) > DURATION ${dropout_threshold_time}\n\t\tAND (SELECT FIRST(event_name) FILTER (\n\t\t\tWHERE event_name IN (${case_end_events}))) IS NULL\n   )",
      category: "Dropouts",
      variables: [
        {
          name: "dropout_threshold_time",
          description:
            "Time threshold for considering a case as idle, for example '21days'",
          defaultValue: "'21days'",
          defaultValues: ["'21days'"],
        },
        {
          name: "case_end_events",
          description:
            "Events that identify when the case is completed, for example 'Incident Closed', 'Clear Invoice', 'Update Opportunity Stage to: Closed Won'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
      ],
      sourceSystems: [
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ECC",
        "SAP_S4HANA",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "time_spent_on_dropouts",
      name: "Amount of time spent on dropouts ",
      description:
        "Total cycle time of all cases until the last event before dropout",
      signalFragment:
        "SUM(\n\t(SELECT LAST(end_time)) - (SELECT FIRST(end_time))) FILTER (\n\t\tWHERE (SELECT LAST(event_name) IN (${dropout_events}))\n   )",
      category: "Dropouts",
      variables: [
        {
          name: "dropout_events",
          description:
            "Events that identify a dropout case, for example 'Reject Quote', 'Update Opportunity Stage to: Dead - No Decision'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SALESFORCE"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "conformance_level",
      name: "Conformance level",
      description: "Percentage of cases without conformance issues",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${conformance_condition})) \n/ COUNT(case_id) \n* 100",
      category: "Conformance",
      variables: [
        {
          name: "conformance_condition",
          description:
            "Sequence of events that describes the \"to-be\" process, for example, using the MATCHES function syntax ^ 'Create Sales Order Item' ~> 'Create Outbound Delivery Item' ~> 'Clear Invoice' $",
          defaultValue:
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          defaultValues: [
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          ],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SERVICENOW",
        "SALESFORCE",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "non_conformant_cases",
      name: "Non-conformant cases",
      description: "Total number of non-conformant cases",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT (event_name MATCHES(${conformance_condition})))",
      category: "Conformance",
      variables: [
        {
          name: "conformance_condition",
          description:
            "Sequence of events that describes the \"to-be\" process, for example, using the MATCHES function syntax ^ 'Create Sales Order Item' ~> 'Create Outbound Delivery Item' ~> 'Clear Invoice' $",
          defaultValue:
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          defaultValues: [
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          ],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SERVICENOW",
        "SALESFORCE",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "cases_compliance_risk",
      name: "Cases at compliance risk",
      description:
        "Number of cases that might face penalty due to compliance violation",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (NOT event_name MATCHES(${conformance_condition})\n\tAND (SELECT BOOL_OR( event_name IN (${compliance_milestone_events})))\n\tAND (SELECT\n\t\tLAST(end_time) FILTER (WHERE event_name IN (${compliance_end_events}))\n\t\t-\n\t\tFIRST(end_time) FILTER (WHERE event_name IN (${compliance_start_events}))\n\t) < DURATION ${compliance_threshold_time}\n\t)\n)",
      category: "Conformance",
      variables: [
        {
          name: "conformance_condition",
          description:
            "Sequence of events that describes the \"to-be\" process, for example, using the MATCHES function syntax ^ 'Create Sales Order Item' ~> 'Create Outbound Delivery Item' ~> 'Clear Invoice' $",
          defaultValue:
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          defaultValues: [
            "^ 'Create Incident'\n\t~> ('Assign Incident to User'|'Assign Incident to Network Group'|'Assign Incident to Service Desk Group')\n\t~> 'Incident in Progress'\n\t~> 'Incident Resolved'\n\t~> 'Close Incident'",
          ],
        },
        {
          name: "compliance_milestone_events",
          description:
            "Events through which the case must flow in order to check for compliance, for example 'Post Goods Issue'",
          defaultValue: "'Incident Resolved'",
          defaultValues: ["'Incident Resolved'"],
        },
        {
          name: "compliance_end_events",
          description:
            "Events defining the end point of the process for the compliance check, for example 'Clear Invoice'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
        {
          name: "compliance_start_events",
          description:
            "Events defining the starting point of the process for the compliance check, for example 'Create Sales Order Item'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
        {
          name: "compliance_threshold_time",
          description: "Threshold compliance time, for example '25 days'",
          defaultValue: "'25days'",
          defaultValues: ["'25days'"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SERVICENOW",
        "SALESFORCE",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_avg_po_processing_time",
      name: "Average processing time for purchase orders",
      description:
        "Average time from the creation of a purchase order to its acknowledgment",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${po_acknowledgement_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${po_creation_events}))\n   )",
      variables: [
        {
          name: "po_acknowledgement_events",
          description:
            "Events indicating the acknowledgement of a purchase order item, for example 'Receive Order Confirmation'",
          defaultValues: [],
        },
        {
          name: "po_creation_events",
          description:
            "Events indicating the creation of a purchase order, for example 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_avg_pr_confirmation_time",
      name: "Average confirmation time for purchase requisitions",
      description:
        "Average time needed to confirm a purchase requisition by creating a purchase order",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${po_creation_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${pr_creation_events}))\n   )",
      variables: [
        {
          name: "po_creation_events",
          description:
            "Events indicating the creation of a purchase order, for example 'Create PO Item'",
          defaultValues: [],
        },
        {
          name: "pr_creation_events",
          description:
            "Events indicating the creation of a purchase requisition item, for example 'Create PR Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_ptp_avg_invoice_payment_time",
      name: "Average invoice payment time",
      description: "Average time to clear invoices",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${invoice_clearing_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${invoice_receipt_events}))\n   )",
      variables: [
        {
          name: "invoice_clearing_events",
          description:
            "Events indicating the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "invoice_receipt_events",
          description:
            "Events indicating the receipt of an invoice, for example 'Record Invoice Receipt', 'Create FI Invoice'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_goods_return_rate",
      name: "Goods return rate",
      description: "Percentage of cases with delivery returns",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT COUNT(event_name)\n\t\t\tWHERE event_name IN (${return_delivery_events})) > 0\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "return_delivery_events",
          description:
            "Events identifying cases of delivery returns, for example 'Return Delivery via Delivery Note'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_avg_po_to_delivery_time",
      name: "Average time from purchase order to delivery",
      description: "Average time from purchase order to goods receipt",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time)\n\t\tWHERE event_name IN (${goods_receipt_events}))\n\t-(SELECT FIRST(end_time)\n\t\tWHERE event_name IN (${po_creation_events}))\n   )",
      variables: [
        {
          name: "goods_receipt_events",
          description:
            "Events identifying the receipt of goods, for example 'Create Goods Receipt'",
          defaultValues: [],
        },
        {
          name: "po_creation_events",
          description:
            "Events indicating the creation of a purchase order, for example 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_ptp_late_payment_rate",
      name: "Late payment rate",
      description:
        "Percentage of cases with late payments. Only cases that are paid are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${late_payment_condition})\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE (${invoice_clearing_date} IS NOT NULL)\n\t)\n* 100",
      variables: [
        {
          name: "late_payment_condition",
          description:
            'Condition that identifies cases with invoices paid late, for example "Last FI Invoice Item Due Date" < "Last FI Invoice Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "invoice_clearing_date",
          description:
            'Attribute referring to the clearing date of an invoice, for example "Last FI Invoice Item Clearing Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_ptp_overdue_payment_rate",
      name: "Overdue payment rate",
      description:
        "Percentage of cases with overdue payments. Only cases that have not been paid yet are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${overdue_payment_condition})\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE (${invoice_clearing_date} IS NULL)\n\t)\n* 100",
      variables: [
        {
          name: "overdue_payment_condition",
          description:
            'Condition that identifies cases with overdue invoices, for example "Last FI Invoice Item Clearing Date" IS NULL AND "Last FI Invoice Item Due Date" < DATE_TRUNC(\'day\', NOW())',
          defaultValues: [],
        },
        {
          name: "invoice_clearing_date",
          description:
            'Attribute referring to the clearing date of an invoice, for example "Last FI Invoice Item Clearing Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_process_compliance",
      name: "Process compliance",
      description: "Percentage of compliant Procure-to-Pay cases",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${ptp_compliant_event_sequence})\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "ptp_compliant_event_sequence",
          description:
            "Sequence of events that fulfil the compliance requirements of a Procure-to-Pay process, for example ^ 'Create PO Item' ~> 'Create Goods Receipt' ~> ('Create FI Invoice'|'Record Invoice Receipt') ~> 'Clear Invoice' $",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_two_way_match_rate",
      name: "Two-way match rate",
      description: "Percentage of purchase orders with a two-way match",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (${two_way_match_condition})\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "two_way_match_condition",
          description:
            'Condition identifying cases with a two-way attribute match, for example "PO Item Net Order Value" = "PO Item Total Invoiced Net Amount Document Curr."',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_po_cancellations_rate",
      name: "Cancellation rate of purchase orders",
      description: "Percentage of cases with cancelled purchase order items",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT FIRST(event_name) FILTER (\n\t\t\tWHERE event_name IN (${po_item_cancellation_events}))) IS NOT NULL\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "po_item_cancellation_events",
          description:
            "Events indicating that a purchase order item was cancelled, for example 'Delete PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_late_deliveries",
      name: "Late deliveries cases",
      description:
        "Number of cases with late deliveries. Only cases that have been completely delivered are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${late_delivery_condition}\n\t\tAND ${delivery_completed_condition}\n\t)",
      variables: [
        {
          name: "late_delivery_condition",
          description:
            'Condition identifying cases that are delivered too late, for example DATE_TRUNC(\'day\', "Last GR Creation Date") > "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_late_deliveries_rate",
      name: "Late deliveries rate",
      description:
        "Percentage of cases with late deliveries. Only cases that have been completely delivered are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${late_delivery_condition}\n\t\tAND ${delivery_completed_condition}\n\t)\n/\nCOUNT(case_id) FILTER (\n\tWHERE ${delivery_completed_condition}\n\t)\n* 100",
      variables: [
        {
          name: "late_delivery_condition",
          description:
            'Condition identifying cases that are delivered too late, for example DATE_TRUNC(\'day\', "Last GR Creation Date") > "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_late_deliveries_net_value",
      name: "Late deliveries net value",
      description:
        "Net order value of cases with late deliveries. Only cases that have been completely delivered are considered.",
      signalFragment:
        "SUM(${po_item_net_order_value}) FILTER (\n\tWHERE ${late_delivery_condition}\n\t\tAND ${delivery_completed_condition}\n\t)",
      variables: [
        {
          name: "po_item_net_order_value",
          description:
            'Attribute referring to the net order value of the PO Item, for example "PO Item Net Order Value in USD"',
          defaultValues: [],
        },
        {
          name: "late_delivery_condition",
          description:
            'Condition identifying cases that are delivered too late, for example DATE_TRUNC(\'day\', "Last GR Creation Date") > "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_late_deliveries_delay",
      name: "Average delay of late deliveries",
      description:
        "The average delay time of late deliveries. Only cases that have been completely delivered are considered.",
      signalFragment:
        "AVG(${goods_receipt_date} - ${delivery_due_date}) FILTER (\n\tWHERE ${late_delivery_condition}\n\t\tAND ${delivery_completed_condition}\n\t)",
      variables: [
        {
          name: "goods_receipt_date",
          description:
            "Attribute referring to the date when the goods have been received, for example DATE_TRUNC('day', \"Last GR Creation Date\")",
          defaultValues: [],
        },
        {
          name: "delivery_due_date",
          description:
            'Attribute referring to the date when the delivery is due, for example "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "late_delivery_condition",
          description:
            'Condition identifying cases that are delivered too late, for example DATE_TRUNC(\'day\', "Last GR Creation Date") > "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_on_time_delivery_rate",
      name: "On-Time Delivery rate",
      description:
        "Percentage of cases with on-time deliveries. Only cases that have been completely delivered are considered.",
      signalFragment:
        "(1 - \n\tCOUNT(case_id) FILTER (\n\t\tWHERE ${late_delivery_condition}\n\t\t\tAND ${delivery_completed_condition}\n\t\t)\n\t/\n\tCOUNT(case_id) FILTER (\n\t\tWHERE ${delivery_completed_condition}\n\t\t)\n)\n* 100",
      variables: [
        {
          name: "late_delivery_condition",
          description:
            'Condition identifying cases that are delivered too late, for example DATE_TRUNC(\'day\', "Last GR Creation Date") > "PO Item Last Requested Delivery Date"',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_overdue_deliveries",
      name: "Overdue deliveries cases",
      description:
        "Number of cases with overdue deliveries. Only cases that have not been (completely) delivered yet are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${overdue_delivery_condition}\n\t)",
      variables: [
        {
          name: "overdue_delivery_condition",
          description:
            'Condition identifying cases with an overdue delivery, for example DATE_TRUNC(\'day\', NOW()) > "PO Item Last Requested Delivery Date"\n\t  AND "PO Item Delivery Completed" IS NULL',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_overdue_deliveries_rate",
      name: "Overdue deliveries rate",
      description:
        "Percentage of cases with overdue deliveries. Only cases that have not been (completely) delivered yet are considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE ${overdue_delivery_condition}\n\t)\n/\nCOUNT(case_id) FILTER (\n\tWHERE (${delivery_completed_condition}) IS NULL\n\t)\n* 100",
      variables: [
        {
          name: "overdue_delivery_condition",
          description:
            'Condition identifying cases with an overdue delivery, for example DATE_TRUNC(\'day\', NOW()) > "PO Item Last Requested Delivery Date"\n\t  AND "PO Item Delivery Completed" IS NULL',
          defaultValues: [],
        },
        {
          name: "delivery_completed_condition",
          description:
            "Condition indicating that the delivery for a PO Item is completed, for example \"PO Item Delivery Completed\" = 'Yes'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_overdue_deliveries_net_value",
      name: "Overdue deliveries net value",
      description:
        "Net order value of cases with overdue deliveries. Only cases that have not been (completely) delivered yet are considered.",
      signalFragment:
        "SUM(${po_item_net_order_value}) FILTER (\n\tWHERE ${overdue_delivery_condition}\n\t)",
      variables: [
        {
          name: "po_item_net_order_value",
          description:
            'Attribute referring to the net order value of the PO Item, for example "PO Item Net Order Value in USD"',
          defaultValues: [],
        },
        {
          name: "overdue_delivery_condition",
          description:
            'Condition identifying cases with an overdue delivery, for example DATE_TRUNC(\'day\', NOW()) > "PO Item Last Requested Delivery Date"\n\t  AND "PO Item Delivery Completed" IS NULL',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_payment_block_rate",
      name: "Payment block rate",
      description: "Percentage of cases in which a payment block was set",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT FIRST(event_name) FILTER (\n\t\t\tWHERE event_name IN (${payment_block_events}))) IS NOT NULL\n\t)\n/ COUNT(case_id)\n* 100",
      variables: [
        {
          name: "payment_block_events",
          description:
            "Events indicating that a payment block was set or removed, for example 'Remove Payment Block', 'Set Payment Block'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_maverick_buying_price_changes",
      name: "Maverick Buying - Prices Changes after Goods Receipt",
      description:
        "Total number of cases with price changes that happened after the Goods Receipt had already been registered",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${ptp_maverick_buying_price_change_condition})\n\t)",
      variables: [
        {
          name: "ptp_maverick_buying_price_change_condition",
          description:
            "Event flow indicating that price changes happened after the Goods Receipt event, for example 'Create Goods Receipt' ~> 'Update PO Item Net Price'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_maverick_buying_rate_po_after_invoice",
      name: "Maverick Buying Rate - PO Creation after Invoice Creation",
      description:
        "Percentage of cases in which the PO Item was created after the Invoice, a common indicator for Maverick Buying",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${ptp_maverick_buying_po_after_invoice_condition})\n\t)\n/ COUNT(case_id) * 100",
      variables: [
        {
          name: "ptp_maverick_buying_po_after_invoice_condition",
          description:
            "Event flow indicating that the Purchase Order was created after the receival of the Invoice, for example 'Create FI Invoice' ~> 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_pos_created_after_invoice_receipt",
      name: "POs created after Invoice Receipt",
      description:
        "Total number of cases in which a PO Item has been created after the Invoice Receipt event",
      signalFragment:
        "COUNT(case_id) FILTER\n\t(WHERE (event_name MATCHES(${po_created_after_invoice_receipt})))",
      variables: [
        {
          name: "po_created_after_invoice_receipt",
          description:
            "Event flow indicating the creation of a PO Item after the Invoice has been received, for example ('Create FI Invoice'|'Record Invoice Receipt') ~> 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_no_touch_order_rate",
      name: "No-touch-order rate",
      description:
        "Percentage of no-touch-orders, which are cases that ran without any changes or typical rework events. Automation of events is not considered.",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT (event_name MATCHES (${ptp_change_event_flow})) AND (event_name MATCHES(${goods_receipt_events}))\n\t)\n/ (COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${goods_receipt_events}))\n\t)\n* 100",
      variables: [
        {
          name: "ptp_change_event_flow",
          description:
            "Event flow indicating that change events happened in a case, for example ('Update PR Net Price'|'Send Purchase Order Update'|'Update PO Item Net Price'|'Update Invoice Payment Terms')",
          defaultValues: [],
        },
        {
          name: "goods_receipt_events",
          description:
            "Events identifying the receipt of goods, for example 'Create Goods Receipt'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_invoices_waiting_for_gr",
      name: "Invoices waiting for Goods Receipt",
      description:
        "Total number of cases with Invoices waiting for the Goods Receipt event",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE NOT (event_name MATCHES(${goods_receipt_events}))\n\tAND (event_name MATCHES(${invoice_receipt_event_flow}))\n\t)",
      variables: [
        {
          name: "goods_receipt_events",
          description:
            "Events identifying the receipt of goods, for example 'Create Goods Receipt'",
          defaultValues: [],
        },
        {
          name: "invoice_receipt_event_flow",
          description:
            "Event flow indicating the receipt of an invoice, for example ('Create FI Invoice'|'Record Invoice Receipt')",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_volume_of_cancelled_orders",
      name: "Volume of cancelled orders",
      description: "Volume of orders in USD that have been cancelled",
      signalFragment:
        "SUM(${po_item_net_order_value}) FILTER (\n\tWHERE event_name MATCHES(${po_item_cancellation_events})\n\t)",
      variables: [
        {
          name: "po_item_net_order_value",
          description:
            'Attribute referring to the net order value of the PO Item, for example "PO Item Net Order Value in USD"',
          defaultValues: [],
        },
        {
          name: "po_item_cancellation_events",
          description:
            "Events indicating that a purchase order item was cancelled, for example 'Delete PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_cancellation_of_gr",
      name: "Cancellation of Goods Receipts",
      description:
        "Total number of cases in which a Goods Receipt has been reversed",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${goods_receipt_reversal_events}))\n\tAND (event_name MATCHES(${goods_receipt_events}))\n\t)",
      variables: [
        {
          name: "goods_receipt_reversal_events",
          description:
            "Events identifying the reversal of a Goods Receipt, for example 'Reverse Goods Receipt'",
          defaultValues: [],
        },
        {
          name: "goods_receipt_events",
          description:
            "Events identifying the receipt of goods, for example 'Create Goods Receipt'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_perfect_order_fulfillment_rate",
      name: "Perfect order fulfillment rate",
      description:
        "Percentage of cases that went through without any reversal of Goods Receipts",
      signalFragment:
        "(COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${goods_receipt_events}))\n\t)\n\t-\n\tCOUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${goods_receipt_reversal_events}))\n\t))\n\t/\n\tCOUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${goods_receipt_events}))\n\t)\n\t* 100",
      variables: [
        {
          name: "goods_receipt_events",
          description:
            "Events identifying the receipt of goods, for example 'Create Goods Receipt'",
          defaultValues: [],
        },
        {
          name: "goods_receipt_reversal_events",
          description:
            "Events identifying the reversal of a Goods Receipt, for example 'Reverse Goods Receipt'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_po_item_changes_rate",
      name: "PO Item changes rate",
      description: "Percentage of cases with PO Item changes",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${po_change_event_flow})))\n\t/\n\tCOUNT(case_id) FILTER (\n\tWHERE (event_name MATCHES(${po_creation_events}))\n\t)\n\t* 100",
      variables: [
        {
          name: "po_change_event_flow",
          description:
            "Events indicating changes to purchase order item, for example 'Update PO Item Net Price'",
          defaultValues: [],
        },
        {
          name: "po_creation_events",
          description:
            "Events indicating the creation of a purchase order, for example 'Create PO Item'",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_late_payments_cycle_time",
      name: "Late payments cycle time",
      description: "Average payment cycle time of cases with late payments",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) FILTER \n\t\t(WHERE event_name IN (${invoice_clearing_events})))\n\t-\n\t(SELECT FIRST(end_time) FILTER \n    \t(WHERE event_name IN (${invoice_receipt_events})))\n\t) FILTER (\n\tWHERE (${late_payment_condition})\n\tAND ${invoice_clearing_date} IS NOT NULL\n\t)",
      variables: [
        {
          name: "invoice_clearing_events",
          description:
            "Events indicating the clearing of an invoice, for example 'Clear Invoice'",
          defaultValues: [],
        },
        {
          name: "invoice_receipt_events",
          description:
            "Events indicating the receipt of an invoice, for example 'Record Invoice Receipt', 'Create FI Invoice'",
          defaultValues: [],
        },
        {
          name: "late_payment_condition",
          description:
            'Condition that identifies cases with invoices paid late, for example "Last FI Invoice Item Due Date" < "Last FI Invoice Item Clearing Date"',
          defaultValues: [],
        },
        {
          name: "invoice_clearing_date",
          description:
            'Attribute referring to the clearing date of an invoice, for example "Last FI Invoice Item Clearing Date"',
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "PROCURE_TO_PAY_invoice_reversal_rate",
      name: "Invoice reversal rate",
      description: "Percentage of cases with reversed invoices",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${invoice_reversal_events})\n\t)\n/ COUNT(case_id) FILTER (\n\tWHERE event_name MATCHES(${invoice_receipt_event_flow})\n\t)\n* 100",
      variables: [
        {
          name: "invoice_reversal_events",
          description:
            "Events identifying the reversal of an Invoice, for example 'Reverse Invoice'",
          defaultValues: [],
        },
        {
          name: "invoice_receipt_event_flow",
          description:
            "Event flow indicating the receipt of an invoice, for example ('Create FI Invoice'|'Record Invoice Receipt')",
          defaultValues: [],
        },
      ],
      sourceSystems: ["SAP_ECC", "SAP_S4HANA"],
      processTypes: [
        {
          id: "PROCURE_TO_PAY",
          name: "Procure-to-Pay",
        },
      ],
      aggregationType: "CASE",
    },
    {
      id: "avg_nr_reworks_per_case",
      name: "Average number of reworks per case",
      description:
        "Average number, per case, of events that appear at least twice",
      signalFragment:
        "AVG((SELECT COUNT(event_name) - COUNT(DISTINCT event_name)))",
      category: "Rework",
      variables: [],
      sourceSystems: [],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_rework_cases",
      name: "Percentage of cases affected by rework",
      description:
        "Number of cases affected by rework divided by the total number of cases",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE\n\t(SELECT BOOL_OR (${minimum_loops_condition})\n\t\tFROM(SELECT OCCURRENCE(event_name) AS occurrence) AS sub\n)\n)/COUNT(case_id)*100",
      category: "Rework",
      variables: [
        {
          name: "minimum_loops_condition",
          description:
            "Minimum number of multiple occurrences for events to be considered as rework, for example: occurrence > 1",
          defaultValue: "occurrence > 1",
          defaultValues: ["occurrence > 1"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_rework_events",
      name: "Percentage of events affected by rework",
      description:
        "Number of events in the process that appear at least twice divided by the total number of events",
      signalFragment:
        "SUM(\n(SELECT COUNT(event_name) - COUNT(DISTINCT event_name))\n)\n/\nSUM((SELECT COUNT(event_name))) * 100",
      category: "Rework",
      variables: [],
      sourceSystems: [],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "avg_cycle_time_rework_cases",
      name: "Average cycle time for cases affected by rework",
      description:
        "Average cycle time calculated from the first to the last event for cases affected by rework",
      signalFragment:
        "AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n)\n\tFILTER (WHERE (SELECT BOOL_OR (${minimum_loops_condition})\n\t\tFROM(SELECT OCCURRENCE(event_name) AS occurrence) AS sub)\n\t\t)",
      category: "Rework",
      variables: [
        {
          name: "minimum_loops_condition",
          description:
            "Minimum number of multiple occurrences for events to be considered as rework, for example: occurrence > 1",
          defaultValue: "occurrence > 1",
          defaultValues: ["occurrence > 1"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "net_avg_rework_cycle_time",
      name: "Net average cycle time spent on rework",
      description:
        "Difference between the average cycle time of the cases that have any rework and the average cycle time of the whole process",
      signalFragment:
        "(AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n)\n\tFILTER (WHERE (SELECT BOOL_OR (${minimum_loops_condition})\n\t\tFROM(SELECT OCCURRENCE(event_name) AS occurrence) AS sub)\n\t\t))\n-\n(AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n))",
      category: "Rework",
      variables: [
        {
          name: "minimum_loops_condition",
          description:
            "Minimum number of multiple occurrences for events to be considered as rework, for example: occurrence > 1",
          defaultValue: "occurrence > 1",
          defaultValues: ["occurrence > 1"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_cases_no_rework",
      name: "Percentage of cases without any rework",
      description:
        "Number of cases not affected by rework divided by the total number of cases",
      signalFragment:
        "100 - (COUNT(case_id) FILTER (WHERE\n\t(SELECT BOOL_OR (${minimum_loops_condition})\n\t\tFROM (SELECT OCCURRENCE(event_name) AS occurrence) AS sub\n)\n)/COUNT(case_id)*100)",
      category: "Rework",
      variables: [
        {
          name: "minimum_loops_condition",
          description:
            "Minimum number of multiple occurrences for events to be considered as rework, for example: occurrence > 1",
          defaultValue: "occurrence > 1",
          defaultValues: ["occurrence > 1"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "fraction_tot_cycle_time_on_rework",
      name: "Fraction of total average cycle time spent on rework",
      description:
        "Ratio between net average cycle time spent on rework and total average cycle time",
      signalFragment:
        "((AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n\t)\n\tFILTER (WHERE (SELECT BOOL_OR (${minimum_loops_condition})\n\t\tFROM (SELECT OCCURRENCE(event_name) AS occurrence) AS sub)\n\t\t))\n-\n(AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n\t))\n)\n/(AVG(\n\t(SELECT LAST(end_time) - FIRST(end_time))\n\t))",
      category: "Rework",
      variables: [
        {
          name: "minimum_loops_condition",
          description:
            "Minimum number of multiple occurrences for events to be considered as rework, for example: occurrence > 1",
          defaultValue: "occurrence > 1",
          defaultValues: ["occurrence > 1"],
        },
      ],
      sourceSystems: [
        "SAP_ECC",
        "SAP_S4HANA",
        "SALESFORCE",
        "SERVICENOW",
        "SAP_ISU",
      ],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "sla_breach_ratio",
      name: "SLA breach ratio on process level, based on SLA events",
      description:
        "Percentage of cases where the SLA was breached, based on events related to SLA breaches",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT FIRST(event_name)\n\t\t\tWHERE event_name IN (${sla_breach_events})) IS NOT NULL)\n/ COUNT(case_id)\n* 100",
      category: "SLAs",
      variables: [
        {
          name: "sla_breach_events",
          description:
            "Events indicating the breach of an SLA, for example 'Incident Resolution SLA Breached'",
          defaultValue:
            "'Incident Resolution SLA Breached','Incident Response SLA Breached'",
          defaultValues: [
            "'Incident Resolution SLA Breached','Incident Response SLA Breached'",
          ],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "sla_violations",
      name: "Number of SLA breaches based on SLA events",
      description:
        "Number of cases where the SLA was breached, based on events related to SLA breaches",
      signalFragment:
        "COUNT(case_id) FILTER (\n\tWHERE (SELECT FIRST(event_name) \n\t\t\tWHERE event_name IN (${sla_breach_events})) IS NOT NULL)",
      category: "SLAs",
      variables: [
        {
          name: "sla_breach_events",
          description:
            "Events indicating the breach of an SLA, for example 'Incident Resolution SLA Breached'",
          defaultValue:
            "'Incident Resolution SLA Breached','Incident Response SLA Breached'",
          defaultValues: [
            "'Incident Resolution SLA Breached','Incident Response SLA Breached'",
          ],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "actual_to_target_sla_ratio",
      name: "Average actual to target SLA ratio",
      description:
        "Ratio between the average incident resolution duration to target SLA duration",
      signalFragment:
        "AVG(\n\t((SELECT LAST(end_time) WHERE event_name IN (${sla_closure_events}))\n\t-(SELECT FIRST(end_time) WHERE event_name IN (${sla_creation_events})))\n) / (DURATION ${target_sla_time})\n*100",
      category: "SLAs",
      variables: [
        {
          name: "sla_closure_events",
          description:
            "Events defining the closing events of a case, for example 'Close Incident'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
        {
          name: "sla_creation_events",
          description:
            "Events defining the start events of a case, for example 'Create Incident'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
        {
          name: "target_sla_time",
          description: "SLA time expectation, for example '15 days'",
          defaultValue: "'15days'",
          defaultValues: ["'15days'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [],
      aggregationType: "CASE",
    },
    {
      id: "percentage_sla_meet_expectations",
      name: "Percentage of incident resolutions that meet SLA expectations",
      description: "Percentage of incident resolutions that met their target",
      signalFragment:
        "COUNT(case_id) FILTER (WHERE (\n\tSELECT LAST(end_time) FILTER (WHERE event_name IN (${sla_closure_events}))\n\t-\n\tFIRST(end_time) FILTER (WHERE event_name IN (${sla_creation_events}))\n\t) < DURATION ${target_sla_time}\n)\n/count(case_id) *100",
      category: "SLAs",
      variables: [
        {
          name: "sla_closure_events",
          description:
            "Events defining the closing events of a case, for example 'Close Incident'",
          defaultValue: "'Close Incident'",
          defaultValues: ["'Close Incident'"],
        },
        {
          name: "sla_creation_events",
          description:
            "Events defining the start events of a case, for example 'Create Incident'",
          defaultValue: "'Create Incident'",
          defaultValues: ["'Create Incident'"],
        },
        {
          name: "target_sla_time",
          description: "SLA time expectation, for example '15 days'",
          defaultValue: "'15days'",
          defaultValues: ["'15days'"],
        },
      ],
      sourceSystems: ["SERVICENOW"],
      processTypes: [],
      aggregationType: "CASE",
    },
  ];
  console.log(metrics);
  console.log(metrics2);

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Welcome to your dictionary!</h2>
      <div className={classes.buttonsContainer}>
        <SecondaryButton onClick={() => navigate(ROUTES.user)} name="Sign in" />
        <PrimaryButton
          onClick={() => navigate(ROUTES.register)}
          exerciseColor
          name="Register"
        />
      </div>
    </div>
  );
};

export default Home;
