import type StatusInterface from '../interfaces/status.ts'

export default ({ status = '', message = '', payload = {} }): StatusInterface => {
    const response: StatusInterface = { status, message, payload };
    return response;
}