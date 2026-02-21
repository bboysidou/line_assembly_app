export class FetchError extends Error {
  status?: number
  message: string

  constructor(props: FetchError) {
    super(props.message)
    this.status = props.status
    this.message = props.message
  }
}
