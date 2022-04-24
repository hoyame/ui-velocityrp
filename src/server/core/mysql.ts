import * as mysql from "mysql";

export class MySQL {
	public static MySQL: mysql.Connection;

	public static initialize() {
		const connectionString = GetConvar("mysql_connection_string", "");
		if (!connectionString) {
			console.error("[GM][Framework] | [MySQL] : Uri is empty. You need to set 'mysql_connection_string' convar");
			return;
		}

		this.MySQL = mysql.createConnection(connectionString);
		this.MySQL.config.timezone = "UTC";
		this.MySQL.connect((err: any) => {
			if (err) {
				console.log(err);
				return;
			}
			console.log("[GM][Framework] | [MySQL] : Connected");
		});

		console.log("[GM][Framework] | [Module] - MySQL Initialized");
	}

	public static QueryAsync(query: string, params: any[]): Promise<any> {
		return new Promise((resolve, reject) => {
			this.MySQL.query(query, params, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}
}
