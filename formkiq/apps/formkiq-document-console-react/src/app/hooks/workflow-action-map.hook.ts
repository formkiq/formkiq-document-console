import { useSelector } from 'react-redux';
import { ConfigState } from '../Store/reducers/config';
import { WorkflowStepActionType } from '../helpers/types/workflows';

export const useWorkflowActionMap = (): Record<
  WorkflowStepActionType,
  string
> => {
  const { formkiqVersion } = useSelector(ConfigState);
  const parametersMap: Record<string, string> = {
    EVENTBRIDGE: 'Amazon EventBridge',
  };
  if (formkiqVersion.modules.indexOf('antivirus') > -1) {
    parametersMap['ANTIVIRUS'] = 'Anti-Malware Scan';
  }
  if (
    formkiqVersion.modules.indexOf('typesense') > -1 ||
    formkiqVersion.modules.indexOf('opensearch') > -1
  ) {
    parametersMap['FULLTEXT'] = 'Fulltext Search';
  }
  parametersMap['IDP'] = 'Intelligent Document Processing';
  parametersMap['DOCUMENTTAGGING'] = 'Intelligent Document Tagging with OpenAI';
  parametersMap['OCR'] = 'Optical Character Recognition (OCR)';
  parametersMap['PUBLISH'] = 'Publish';
  parametersMap['QUEUE'] = 'Review / Approval Queue';
  parametersMap['NOTIFICATION'] =
    'Send Notification (requires "FROM" address in SES)';
  parametersMap['WEBHOOK'] = 'Webhook';

  return parametersMap;
};
