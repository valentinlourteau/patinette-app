<template>
	<div>

		<img style="position:fixed;z-index:4;top:12px;height:56px;left:50%;transform: translateX(-50%);" src="/static/img/flashtrottjour-logo.jpg">

		<div style="height:100%;position:fixed;">
			<GmapMap
			:center="{lat:10, lng:10}"
			:zoom="17"
			map-type-id="terrain"
			style="width: 500px; height: 100%"
			ref="trotinettesMapRef"
			:options="{
				zoomControl: true,
				mapTypeControl: false,
				scaleControl: false,
				streetViewControl: false,
				rotateControl: false,
				fullscreenControl: true,
				disableDefaultUi: false
			}"
			>
			<GmapMarker
			:key="index"
			v-for="(m, index) in markers"
			:position="m.position"
			:clickable="true"
			:draggable="true"
			icon="/static/img/icone-flashtrott-map-mini.png"
			@click="center=m.position"
			/>
		</GmapMap>
	</div>

	<!-- Bouton pour réserver un bolide -->
	<div class="text-xs-center">
		<v-btn
		round
		color="primary"
		large
		fixed
		style="left:50%;transform:translateX(-50%);bottom:36px;"
		dark
		v-if="currentLocation == null"
		@click="onClickPictureQRCode()">
		<span style="margin-right: 12px;">Scanner le bolide</span>
		<v-icon>photo_camera</v-icon>
	</v-btn>
</div>

<!-- Panel de location en cours pour notamment achever la location -->
<v-card
v-if="currentLocation != null"
style="position:fixed;bottom:36px;left:50%;transform: translateX(-50%);width: 80%;"
>

<v-card-title primary-title>
	<div>
		<h3 class="headline mb-0">Une location est en cours !</h3>
	</div>
</v-card-title>

<v-card-text>
	<div class="body-2">
		Temps écoulé depuis le début : {{estimatedTime}}
	</div>
	<div class="body-2">
		Coût estimé : {{estimatedPrice}}
	</div>
</v-card-text>

<v-card-actions>
	<v-btn flat color="orange" @click="onClickEndLocation()">TERMINER LA LOCATION</v-btn>
</v-card-actions>

</v-card>


<qrcode-stream v-if="keepDecoding" :track="keepDecoding" @decode="onDecode"></qrcode-stream>

<v-layout row justify-center>
	<v-dialog
	v-model="dialogValidateTrottinette"
	max-width="500px"
	transition="dialog-transition"
	persistent
	>
	<v-card>
		<v-card-title>
			<span class="headline">Dernière étape !</span>
			<span class="subheading grey--text">On démarre le moteur électrique..</span>
		</v-card-title>
		<v-card-text>

			<span>Le tarif de la location d'une trottinette comporte un coût fixe de 1€ pour la location, puis 0.15€ par minute.
				<br/>Par exemple, un trajet de 15 minutes vous reviendra à 3€25. Veuillez consultez notre FAQ pour plus de renseignements sur les conditions d'utilisation du service.
			</span>

			<v-alert
			:value="true"
			type="warning"
			>
			Valider entrainera le début du minuteur et par conséquent le débit du moyen de payement précisé.
		</v-alert>

	</v-card-text>
	<v-card-actions>
		<v-spacer></v-spacer>
		<v-btn color="green darken-1" flat @click="dialogValidateTrottinette = false">ANNULER</v-btn>
		<v-btn color="green darken-1" flat @click="onClickValidateReservation()">VALIDER</v-btn>
	</v-card-actions>
</v-card>
</v-dialog>
</v-layout>

</div>
</template>

<script>
	export default {

		name: 'Carte',
		mounted() {
			this.$refs.trotinettesMapRef.$mapPromise.then((map) => {
				map.panTo({lat:43.296219, lng:5.371826})
			})
			this.axios.get("trottinette/allTrottinettes")
			.then(response => {
				if (response.status == 200) {
					console.log(response.data);
					response.data.forEach(element => {
						this.markers.push({
							position: {lat:element.lat , lng:element.lng}
						});
					});
				}
			});
			this.axios.post("trottinette/runningLocation", this.$session.get('user'))
			.then(response => {
				if (response.status == 200) {
					this.currentLocation = response.data;
					this.onRefreshPriceAndTimeRecursively();
				}
			})
		},
		data () {
			return {
				keepDecoding: false,
				dialogValidateTrottinette: false,
				markers: [],
				currentLocation: null,
				selectedTrottinetteId: null,
				estimatedTime: null,
				estimatedPrice: null
			}
		},
		methods: {
			onClickPictureQRCode() {
				this.keepDecoding = !this.keepDecoding;
			},
			onDecode (decodedString) {
				console.log(decodedString);
				this.selectedTrottinetteId = decodedString;
				this.keepDecoding = false;
				this.dialogValidateTrottinette = true;
			},
			onClickValidateReservation() {
				//valider la location
				this.axios
				.post("trottinette/startLocation", {
					user:  this.$session.get('user'),
					trottinette: {
						id: this.selectedTrottinetteId
					}
				}).then(response => {
					if (response.status == 201) {
						console.log(response.data);
						this.currentLocation = response.data;
						console.log(this.currentLocation.dateResaString);
						this.dialogValidateTrottinette = false;
						this.onRefreshPriceAndTimeRecursively();
					}
				});
			},
			onClickEndLocation() {
				this.axios
				.post("trottinette/endLocation", {
					id: this.currentLocation.id
				}).then(response => {
					if (response.status == 202) {
						console.log(response.data);
						this.currentLocation = null;
					}
				});
			},
			onRefreshPriceAndTimeRecursively() {
				setTimeout(() => {
					this.estimatedTime = this.msToTime(new Date() - new Date(this.currentLocation.dateResaString));
					var minutes = Math.floor(((new Date() - new Date(this.currentLocation.dateResaString)) / (1000 * 60)) % 60);
					this.estimatedPrice = 1 + 0.15 * minutes;
					this.estimatedPrice = this.estimatedPrice.toString().substring(0, 6);
					this.estimatedPrice = this.estimatedPrice.replace('.', '€');
					this.onRefreshPriceAndTimeRecursively();
				}, 1000);
			},
			msToTime(duration) {
				var seconds = Math.floor((duration / 1000) % 60),
				minutes = Math.floor((duration / (1000 * 60)) % 60);

				return minutes + "min" + seconds + "s";
			}
		}
	}
</script>

<style lang="css" scoped>
.qrcode-stream {
	position: fixed;
	top: 50%;
	transform: translateY(-50%);
	margin: 0 20px;
	border: 4px white solid;
}
</style>