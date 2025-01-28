import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DocumentsService } from '../../helpers/services/documentsService';
import { RequestStatus, Rule, Ruleset } from '../../helpers/types/rulesets';
import { RootState } from '../store';
import { openDialog as openNotificationDialog } from './globalNotificationControls';

interface RulesetsState {
  rulesets: Ruleset[];
  ruleset: Ruleset;
  rules: Rule[];
  rule: Rule;
  loadingStatus: keyof typeof RequestStatus;
  nextToken: string | null;
  currentSearchPage: number;
  isLastSearchPageLoaded: boolean;
  isLoadingMore: boolean;
}

const defaultState: RulesetsState = {
  rulesets: [],
  ruleset: {
    rulesetId: '',
    description: '',
    priority: 0,
    version: 0,
    insertedDate: '',
    status: 'ACTIVE',
  },
  rules: [],
  rule: {
    ruleId: '',
    priority: 0,
    description: '',
    workflowId: '',
    status: 'ACTIVE',
    conditions: {
      must: [
        {
          criterion: 'TEXT',
          fieldName: '',
          value: '',
          operation: 'EQ',
        },
      ],
    },
  },
  loadingStatus: RequestStatus.fulfilled,
  nextToken: null,
  currentSearchPage: 1,
  isLastSearchPageLoaded: false,
  isLoadingMore: false,
};

export const fetchRulesets = createAsyncThunk(
  'rulesets/fetchRulesets',
  async (data: any, thunkAPI) => {
    const { siteId, nextToken, limit, page } = data;
    await DocumentsService.getRulesets(siteId, nextToken, limit).then(
      (response) => {
        if (response) {
          const data = {
            siteId,
            rulesets: response.rulesets,
            isLoadingMore: false,
            isLastSearchPageLoaded: false,
            next: response.next,
            page,
          };
          if (page > 1) {
            data.isLoadingMore = true;
          }
          if (response.documents?.length === 0) {
            data.isLastSearchPageLoaded = true;
          }
          thunkAPI.dispatch(setRulesets(data));
        }
      }
    );
  }
);

export const fetchRuleset = createAsyncThunk(
  'rulesets/fetchRuleset',
  async (data: any, thunkAPI) => {
    const { rulesetId, siteId } = data;
    await DocumentsService.getRuleset(rulesetId, siteId).then((response) => {
      if (response) {
        const data = {
          rulesetId,
          siteId,
          ruleset: response.ruleset,
        };
        thunkAPI.dispatch(setRuleset(data));
      }
    });
  }
);

export const deleteRuleset = createAsyncThunk(
  'rulesets/deleteRuleset',
  async (data: any, thunkAPI) => {
    const { siteId, rulesetId, rulesets } = data;
    await DocumentsService.deleteRuleset(rulesetId, siteId).then((response) => {
      if (response.status === 200) {
        thunkAPI.dispatch(
          setRulesets({
            rulesets: rulesets.filter(
              (ruleset: Ruleset) => ruleset.rulesetId !== rulesetId
            ),
          })
        );
      } else {
        thunkAPI.dispatch(
          openNotificationDialog({ dialogTitle: response.message })
        );
      }
    });
  }
);

export const fetchRules = createAsyncThunk(
  'rulesets/fetchRulesets',
  async (data: any, thunkAPI) => {
    const { siteId, rulesetId, nextToken, limit, page } = data;
    await DocumentsService.getRules(rulesetId, siteId, nextToken, limit).then(
      (response) => {
        if (response) {
          const data = {
            siteId,
            rules: response.rules,
            isLoadingMore: false,
            isLastSearchPageLoaded: false,
            next: response.next,
            page,
          };
          if (page > 1) {
            data.isLoadingMore = true;
          }
          if (response.documents?.length === 0) {
            data.isLastSearchPageLoaded = true;
          }
          thunkAPI.dispatch(setRules(data));
        }
      }
    );
  }
);

export const fetchRule = createAsyncThunk(
  'rulesets/fetchRule',
  async (data: any, thunkAPI) => {
    const { siteId, rulesetId, ruleId } = data;
    await DocumentsService.getRule(rulesetId, ruleId, siteId).then(
      (response) => {
        if (response) {
          thunkAPI.dispatch(setRule(response));
        }
      }
    );
  }
);

export const deleteRule = createAsyncThunk(
  'rulesets/deleteRuleset',
  async (data: any, thunkAPI) => {
    const { siteId, ruleId, rulesetId, rules } = data;
    await DocumentsService.deleteRule(rulesetId, ruleId, siteId).then(
      (response) => {
        if (response.status === 200) {
          thunkAPI.dispatch(
            setRules({
              rules: rules.filter((rule: Rule) => rule.ruleId !== ruleId),
            })
          );
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({ dialogTitle: response.message })
          );
        }
      }
    );
  }
);

export const rulesetsSlice = createSlice({
  name: 'rulesets',
  initialState: defaultState,
  reducers: {
    setRulesetsLoadingStatusPending: (state) => {
      return {
        ...state,
        loadingStatus: RequestStatus.pending,
      };
    },

    setRulesets: (state, action) => {
      const { rulesets, isLoadingMore, next, page } = action.payload;
      let { isLastSearchPageLoaded = false } = action.payload;
      isLastSearchPageLoaded = !next;
      if (rulesets) {
        if (isLoadingMore) {
          state.rulesets = state.rulesets.concat(rulesets);
        } else {
          state.rulesets = rulesets;
        }
        state.nextToken = next;
        state.isLastSearchPageLoaded = isLastSearchPageLoaded;
      }
      state.loadingStatus = RequestStatus.fulfilled;
      state.rules = [];
    },

    setRuleset: (state, action) => {
      const { ruleset } = action.payload;
      if (ruleset) {
        state.ruleset = ruleset;
      }
      state.loadingStatus = RequestStatus.fulfilled;
    },

    setRules: (state, action) => {
      const { rules, isLoadingMore, next, page } = action.payload;
      let { isLastSearchPageLoaded = false } = action.payload;
      isLastSearchPageLoaded = !next;
      if (rules) {
        if (isLoadingMore) {
          state.rules = state.rules.concat(rules);
        } else {
          state.rules = rules;
        }
        state.nextToken = next;
        state.isLastSearchPageLoaded = isLastSearchPageLoaded;
      }
      state.loadingStatus = RequestStatus.fulfilled;
      state.rulesets = [];
    },

    setRule: (state, action) => {
      const { rule } = action.payload;
      state.rule = rule;
      return state;
    },
  },
});

export const {
  setRulesets,
  setRuleset,
  setRulesetsLoadingStatusPending,
  setRules,
  setRule,
} = rulesetsSlice.actions;

export const RulesetsState = (state: RootState) => state.rulesetsState;

export default rulesetsSlice.reducer;
