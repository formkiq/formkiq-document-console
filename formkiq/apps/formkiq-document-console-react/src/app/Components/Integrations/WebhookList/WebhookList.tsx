import { useEffect, useRef, useState } from 'react'
import { RootState } from "../../../Store/store"
import { connect, ConnectedProps, useDispatch } from "react-redux"
import { Plus } from "../../Icons/icons"
import { openDialog} from "../../../Store/reducers/globalConfirmControls"
import { DocumentsService } from '../../../helpers/services/documentsService'

type Props = { 
  siteId: string, 
  isSiteReadOnly: boolean,
  onNewClick: any,
  webhooks: null | [],
  onDelete: (webhookId: string, siteId: string) => void
}

export function WebhookList( { siteId, isSiteReadOnly, onNewClick, webhooks, onDelete }: Props) {

  const onDeleteClick = (webhookId: string, siteId: string) => () => {
    onDelete(webhookId, siteId)
  }

  return (
    <>
      { !isSiteReadOnly && (
        <div className="mt-4 flex px-4">
          <button
            className="flex bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-sm font-semibold rounded-2xl flex cursor-pointer focus:outline-none py-2 px-4"
            onClick={event => onNewClick(event, siteId)}
            >
            <span > 
              Create new 
            </span>
            <div className="w-3 h-3 ml-1.5 mt-1">
              {Plus()}
            </div>
          </button>
        </div>
      )}
      <div className="mt-4 mb-8">
        <table className="w-full border-collapse text-sm">
          <thead>
              <tr>
              <th className="w-1/8 border-b nodark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">Name</th>
              <th className="w-3/4 border-b nodark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">URL</th>
              <th className="w-1/8 border-b nodark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">Actions</th>
              </tr>
          </thead>
          <tbody className="bg-white nodark:bg-slate-800">
            {webhooks && (webhooks as any).length ? (
              <>
                {(webhooks as any).map((webhook: any, i: number) => {
                  return (
                    <tr key={i}>
                      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pl-8 text-slate-500 nodark:text-slate-400">
                        {webhook.name}
                      </td>
                      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 text-slate-500 nodark:text-slate-400">
                        {webhook.url}
                      </td>
                      <td className="border-b border-slate-100 nodark:border-slate-700 p-4 pr-8 text-slate-500 nodark:text-slate-400">
                      <button
                        onClick={onDeleteClick(webhook.id, siteId)}
                        className='bg-gradient-to-l from-red-500 via-rose-500 to-red-600 hover:from-red-600 hover:via-rose-600 hover:to-red-700 text-white text-sm font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none'>
                        Delete
                      </button>
                      </td>
                    </tr>
                  )
                })}
              </>
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-2">
                  No webhooks have been found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}


const mapStateToProps = (state: RootState) => {
  return { user: state.authReducer?.user }
}

const connector = connect(mapStateToProps)
type ComponentProps = ConnectedProps<typeof connector>
export default connector(WebhookList)