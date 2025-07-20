export class Message {
    constructor(private readonly entityName: string) {}

    getBy(field: string) {
        return `Get ${this.capitalize(this.entityName)}s by ${field} successfully.`
    }

    getAll() {
        return `Get ${this.capitalize(this.entityName)}s successfully.`
    }

    created() {
        return `${this.capitalize(this.entityName)} created successfully.`
    }

    updated() {
        return `${this.capitalize(this.entityName)} updated successfully.`
    }

    deleted() {
        return `${this.capitalize(this.entityName)} deleted successfully.`
    }

    notFound() {
        return `${this.capitalize(this.entityName)} not found.`
    }

    error() {
        return `Failed to process ${this.entityName.toLowerCase()}.`
    }

    success() {
        return `${this.capitalize(this.entityName)} completed successfully.`
    }

    private capitalize(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1)
    }
}
