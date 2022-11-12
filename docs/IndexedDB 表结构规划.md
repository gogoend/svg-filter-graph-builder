# IndexedDB 表结构规划

# 表

- 应用信息表

用于存放当前应用的信息，以用于版本迭代、数据升迁等相关用途。主要包括：

  1. 产品名称
  2. 产品版本（语意化版本）
  3. 构建时间
  4. 构建版本（内部版本）

  表以产品id作为索引，结构形如：

  ```ts
    type ProductMap = {
      [productId: string]: {
        id: string,
        version: string,
        buildTime: string,
        buildVersion: number
      }
    }
  ```

- 文件表

用于存放用户已编排的滤镜的工程文件（以JSON存储）。

  表以文件id为索引，结构形如：

  ```ts
    type FileMap = {
      [fileId: string]: ProjectFileContent
    }
  ```

  ProjectFileContent的文档见 [项目文件结构规划.md](./项目文件结构规划.md)

- 用户配置表

用于存放用户偏好设置等。早期版本中没有相关用户偏好设置，可留空。

  表以用户id为索引，结构形如：

  ```ts
    type UserProfileMap = {
      [userId: string]: {}
    }
  ```