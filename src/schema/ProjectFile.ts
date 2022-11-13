import { LinkInStore, NodeFormValue, NodeInStore } from './IoNode'

export type ProjectFile = {
  /**
   * 文件唯一标识
   */
  id: string
  /**
   * 画布内容
   */
  stuff: {
    /**
     * 节点
     */
    nodes: Record<NodeInStore['id'], NodeInStore>
    /**
     * 节点表单内容
     */
    nodeForms: Record<NodeFormValue['id'], NodeFormValue>
    /**
     * 连线
     */
    links: Record<LinkInStore['id'], LinkInStore>
  }
  /**
   * 保存此工程的产品的信息
   */
  product: {
    /**
     * 名称
     */
    name: string
    /**
     * 版本
     */
    version: string
    /**
     * 内部版本
     */
    buildVersion: number
  }
  /**
   * 项目信息
   */
  project: {
    /**
     * 名称
     */
    name: string
    /**
     * 作者
     */
    author: string
    /**
     * 创建时间
     */
    createdTime: number
    /**
     * 修改时间
     */
    modifiedTime: number
  }
}
